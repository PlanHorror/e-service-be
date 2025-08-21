import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful.',
    schema: { properties: { accessToken: { type: 'string' } } },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @Post('login')
  async login(@Body() data: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(data);
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Registration successful.',
    schema: { properties: { accessToken: { type: 'string' } } },
  })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists.',
  })
  @Post('register')
  async register(@Body() data: RegisterDto): Promise<{ accessToken: string }> {
    return this.authService.register(data);
  }
}
