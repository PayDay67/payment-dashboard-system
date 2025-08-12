import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    console.log(`🔍 User found: ${!!user}`);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(`🔒 Password valid: ${isPasswordValid}`);
      if (isPasswordValid) {
        const { password, ...result } = user.toObject();
        return result;
      }
    }
    return null;
  }

  async login(username: string, password: string) {
    console.log(`🔑 Login attempt for username: ${username}`);
    const user = await this.validateUser(username, password);
    if (!user) {
      console.log('❌ Login failed: Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }
    
    console.log(`✅ Login successful for user: ${username}`);
    const payload = { username: user.username, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
      },
    };
  }

  async createDefaultAdmin() {
    try {
      const existingAdmin = await this.userModel.findOne({ username: 'admin' });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const admin = new this.userModel({
          username: 'admin',
          password: hashedPassword,
          role: 'admin',
          email: 'admin@example.com',
        });
        await admin.save();
        console.log('✅ Default admin created: admin/password123');
      } else {
        console.log('ℹ️  Admin user already exists');
      }
    } catch (error) {
      console.error('❌ Error creating default admin:', error);
    }
  }
}