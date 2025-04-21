import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignUpAuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

export class GoogleAuthDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

export class GithubAuthDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
