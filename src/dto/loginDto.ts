import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsString({ message: "Email must be a string" })
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}
