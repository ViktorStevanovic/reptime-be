import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto } from './dto/auth.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(
    @Body() loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Body() refreshDto: RefreshDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = await this.jwtService.verifyAsync<{ sub: string }>(
      refreshDto.refreshToken,
    );
    return this.authService.refreshTokens(payload.sub, refreshDto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Request() req: Request & { user: Record<string, unknown> },
  ): Promise<{ message: string }> {
    await this.authService.logout(req.user['sub'] as string);
    return Promise.resolve({ message: 'Logged out successfully' });
  }

  @Get('profile')
  getProfile(
    @Request() req: Request & { user: Record<string, unknown> },
  ): Record<string, unknown> {
    return req.user;
  }
}
