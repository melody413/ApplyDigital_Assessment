import { Controller, Post, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Public-Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token with mock-up' })
  @ApiResponse({ status: 201, description: 'JWT token returned.' })
  async login(@Body() body: LoginDto) {
    const payload = { username: body.username, sub: 1 };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }
}