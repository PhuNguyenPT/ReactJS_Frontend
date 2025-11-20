import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class LoginDto {
  @IsString({ message: "validation.email.string" })
  @IsEmail({}, { message: "validation.email.invalid" })
  @Matches(/^[a-zA-Z0-9@._+-]+$/, {
    message: "validation.email.englishOnly",
  })
  @IsNotEmpty({ message: "validation.email.required" })
  email!: string;

  @IsString({ message: "validation.password.string" })
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/, {
    message: "validation.password.englishOnly",
  })
  @IsNotEmpty({ message: "validation.password.required" })
  password!: string;
}
