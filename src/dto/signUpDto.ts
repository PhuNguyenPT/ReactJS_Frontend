import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class SignupDto {
  @IsString({ message: "Email must be a string" })
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" }) // ✅ Moved to last position
  email!: string;

  @IsString({ message: "Password must be a string" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]{8,128}$/,
    {
      message:
        "Password must be 8-128 characters and include uppercase, lowercase, number, and special character.",
    },
  )
  @IsNotEmpty({ message: "Password is required" }) // ✅ Moved to last position
  password!: string;

  @IsString({ message: "Confirm password must be a string" })
  @IsNotEmpty({ message: "Please confirm your password" })
  confirmPassword!: string;
}
