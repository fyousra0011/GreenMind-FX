import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Length(1, 255)
  tenantId!: string;

  @IsString()
  @Length(1, 255)
  siteId!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 128)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password!: string;
}
