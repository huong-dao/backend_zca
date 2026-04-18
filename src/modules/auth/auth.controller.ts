import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { AuthenticatedUser } from '../../common/utils/authenticated-user';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private getAuthCookieOptions(): CookieOptions {
    const secure =
      this.configService.get<boolean>('auth.cookieSecure') ?? false;

    return {
      httpOnly: true,
      secure,
      sameSite:
        this.configService.get<'lax' | 'strict' | 'none'>(
          'auth.cookieSameSite',
        ) ?? 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
  }

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    const cookieName =
      this.configService.get<string>('auth.cookieName') ?? 'access_token';

    res.cookie(cookieName, result.accessToken, this.getAuthCookieOptions());

    return {
      user: result.user,
    };
  }

  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    const cookieName =
      this.configService.get<string>('auth.cookieName') ?? 'access_token';
    const { httpOnly, secure, sameSite, path } = this.getAuthCookieOptions();

    res.clearCookie(cookieName, {
      httpOnly,
      secure,
      sameSite,
      path,
    });

    return {
      message: 'Logged out successfully.',
    };
  }

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return {
      user,
    };
  }
}
