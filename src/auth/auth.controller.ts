
import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './jwt/auth.guard';
import { CreateUserDto } from 'src/user/dto/create.user.dto';
import { LoginDto } from 'src/user/dto/login.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() req:LoginDto) {
    return this.authService.login(req);
  }

    @Post('register')
    async register(@Body() req:CreateUserDto) {
        return this.authService.register(req);
    }
}
