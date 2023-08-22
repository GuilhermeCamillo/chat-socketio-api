import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/app/users/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any) {
    return await this.authService.login(req.user);
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return await this.authService.signup(body);
  }
}
