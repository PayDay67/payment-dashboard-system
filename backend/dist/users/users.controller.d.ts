import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: any): Promise<import("./user.schema").User>;
    findAll(): Promise<import("./user.schema").User[]>;
    findOne(id: string): Promise<import("./user.schema").User>;
}
