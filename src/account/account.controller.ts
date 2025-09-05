import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { RegisterDto, UpdateUserDto } from '../auth/dto/auth.dto';
import { ProfileUpdateDto } from './dto/profile-update.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully' })
  findAll() {
    return this.accountService.getAllAccounts();
  }

  @Get('profile/:id')
  @ApiOperation({ summary: 'Get profile by user ID' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfileById(@Param('id') id: string) {
    return this.accountService.getProfileById(id);
  }

  @Put('profile/:id')
  @ApiOperation({ summary: 'Update profile by user ID' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Email already exists' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfileById(@Param('id') id: string, @Body() profileData: ProfileUpdateDto) {
    return this.accountService.updateProfile(id, profileData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiResponse({ status: 200, description: 'Account retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  findOne(@Param('id') id: string) {
    return this.accountService.getAccountById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new account' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 409, description: 'Username or email already exists' })
  create(@Body() data: RegisterDto) {
    return this.accountService.newAccount(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update account' })
  @ApiResponse({ status: 200, description: 'Account updated successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.accountService.updateAccountService(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  remove(@Param('id') id: string) {
    return this.accountService.deleteAccount(id);
  }
}