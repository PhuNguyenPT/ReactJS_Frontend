import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class SignupDto {
  @IsString({ message: "validation.email.string" })
  @IsEmail({}, { message: "validation.email.invalid" })
  @Matches(/^[a-zA-Z0-9@._+-]+$/, {
    message: "validation.email.englishOnly",
  })
  @IsNotEmpty({ message: "validation.email.required" })
  email!: string;

  @IsString({ message: "validation.password.string" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]{8,128}$/,
    {
      message: "validation.password.pattern",
    },
  )
  @IsNotEmpty({ message: "validation.password.required" })
  password!: string;

  @IsString({ message: "validation.confirmPassword.string" })
  @IsNotEmpty({ message: "validation.confirmPassword.required" })
  confirmPassword!: string;
}
