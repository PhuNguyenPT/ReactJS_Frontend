import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsString({ message: "validation.email.string" })
  @IsEmail({}, { message: "validation.email.invalid" })
  @IsNotEmpty({ message: "validation.email.required" })
  email!: string;

  @IsString({ message: "validation.password.string" })
  @IsNotEmpty({ message: "validation.password.required" })
  password!: string;
}
