import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  public name: string;

  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(6)
  public password: string;
}
