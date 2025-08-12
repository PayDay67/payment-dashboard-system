"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const user_schema_1 = require("../users/user.schema");
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async validateUser(username, password) {
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
    async login(username, password) {
        console.log(`🔑 Login attempt for username: ${username}`);
        const user = await this.validateUser(username, password);
        if (!user) {
            console.log('❌ Login failed: Invalid credentials');
            throw new common_1.UnauthorizedException('Invalid credentials');
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
            }
            else {
                console.log('ℹ️  Admin user already exists');
            }
        }
        catch (error) {
            console.error('❌ Error creating default admin:', error);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map