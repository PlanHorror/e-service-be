import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Role } from 'generated/prisma';

export class LoginDto {
  @ApiProperty({ description: 'Username for login', example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Password for login', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Username', example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Confirm password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+84987654321',
    required: false,
  })
  @IsPhoneNumber('VN')
  @IsOptional()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Address',
    example: '123 Main St',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'User role', enum: Role, example: Role.ADMIN })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
