import {
  Injectable,
  Dependencies,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Dependencies(UsersService, JwtService)
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateTokens(payload: {
    email: string;
    sub: string;
    role: string;
  }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { email: user.email, sub: user.id, role: user.role.code };
    const tokens = await this.generateTokens(payload);

    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return tokens;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isMatch) {
      throw new ForbiddenException('Access denied');
    }

    const payload = { email: user.email, sub: user.id, role: user.role.code };
    const tokens = await this.generateTokens(payload);

    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
