import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  registerUser() {
    return 'auth register';
  }

  @MessagePattern('auth.login.user')
  loginUser(@Payload() id: number) {
    return 'auth login';
  }
  @MessagePattern('auth.verify.user')
  veryfyUser(@Payload() id: number) {
    return 'auth verify';
  }
}
