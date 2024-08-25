import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  async registerUser(@Payload() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @MessagePattern('auth.login.user')
  loginUser(@Payload() loginUser: LoginUserDto) {
    return this.authService.login(loginUser);
  }
  @MessagePattern('auth.verify.user')
  veryfyUser(@Payload() token: string) {
    return this.authService.verifyToken(token);
  }
}
