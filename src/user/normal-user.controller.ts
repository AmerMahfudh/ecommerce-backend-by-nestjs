import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Req,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from './Guards/Auth.guard';
import { Roles } from './decorators/Roles.decorator';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('userMe')
export class UserMeController {
    constructor(private readonly userService: UserService) {}

  // For Normal User
    @Get()
    @Roles(['admin','user'])
    @UseGuards(AuthGuard)
    async getMe(@Req()req){
        return await this.userService.getMe(req.user);
    }

    @Patch()
    @Roles(['user','admin'])
    @UseGuards(AuthGuard)
    async updateMe(@Req()req,@Body(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted:true,
    }),)updateUserDto:UpdateUserDto){
        return await this.userService.updateMe(req.user,updateUserDto);
    }

    @Delete()
    @Roles(['user'])
    @UseGuards(AuthGuard)
    async deleteMe(@Req()req){
        return await this.userService.deleteMe(req.user);
    }
}

