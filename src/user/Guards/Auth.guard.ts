import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Roles } from '../decorators/Roles.decorator';
import { CURRNET_USER_KEY } from 'utilies/constant';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly reflector:Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request:Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) {
            return true;
        }
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret:this.configService.get<string>('JWT_SECRET')
                }
            );
            if(!payload._id && payload.role === 'admin') {
                request[CURRNET_USER_KEY] = payload;
                return true;
            }
            if(!payload.role ||payload.role===''|| !roles.includes(payload.role)){
                throw new UnauthorizedException();
            }
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request[CURRNET_USER_KEY] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' && token ? token : undefined;
    }
}
