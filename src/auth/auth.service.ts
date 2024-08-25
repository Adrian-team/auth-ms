import * as bcrypt from 'bcryptjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { RegisterUserDto } from './dto/register-user';
import { RpcException } from '@nestjs/microservices';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/config/envs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    try {
      const existingUser = await this.userModel
        .findOne({ email: registerUserDto.email })
        .exec();

      if (existingUser) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'User with this email already exists',
        });
      }

      const saltOrRounds = 10;
      const hash = bcrypt.hashSync(registerUserDto.password, saltOrRounds);

      registerUserDto.password = hash;
      const createdUser = new this.userModel(registerUserDto);
      const user = await createdUser.save();
      const payload = { name: user.name, email: user.email, id: user._id };
      return {
        user: user,
        token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.userModel
        .findOne({ email: loginUserDto.email })
        .lean();

      if (!user) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'Icorrect user or password',
        });
      }
      const isValid = bcrypt.compareSync(loginUserDto.password, user.password);

      if (!isValid) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'Icorrect user or password',
        });
      }

      delete user.password;
      const payload = { name: user.name, email: user.email, id: user._id };
      return {
        user: user,
        token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }
  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: envs.secretToken,
      });

      delete payload.iat;
      delete payload.exp;

      return payload;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid token',
      });
    }
  }
}
