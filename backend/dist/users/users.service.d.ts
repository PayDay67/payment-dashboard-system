import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(userData: any): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
}
