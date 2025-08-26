import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { RegisterDto, UpdateUserDto } from 'src/auth/dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

// @UseGuards(AuthGuard('jwt'))
@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  findAll() {
    return this.accountService.getAllAccounts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.getAccountById(id);
  }

  @Post()
  create(@Body() data: RegisterDto) {
    return this.accountService.newAccount(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.accountService.updateAccountService(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.deleteAccount(id);
  }
}
