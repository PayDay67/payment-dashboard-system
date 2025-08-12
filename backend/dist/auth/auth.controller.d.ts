import { OnModuleInit } from '@nestjs/common';
import { AuthService } from './auth.service';
export declare class AuthController implements OnModuleInit {
    private authService;
    constructor(authService: AuthService);
    onModuleInit(): Promise<void>;
    login(loginDto: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            role: any;
            email: any;
        };
    }>;
}
