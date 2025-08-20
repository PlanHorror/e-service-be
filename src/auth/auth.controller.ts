import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(data);
  }

  @Post('register')
  async register(@Body() data: RegisterDto): Promise<{ accessToken: string }> {
    return this.authService.register(data);
  }
}
