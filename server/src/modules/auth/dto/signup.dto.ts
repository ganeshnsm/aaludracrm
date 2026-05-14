import { IsString, IsEmail, MinLength, IsOptional } from "class-validator";
import { Match } from "../../../common/decorators/match.decorator";

export class SignupDto {
    @IsEmail({}, { message: "Invalid Email" })
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    name: string;

    @IsString()
    @MinLength(6)
    @Match("password", { message: "Passwords do not match" })
    confirmPassword: string;

    @IsOptional()
    @IsString()
    token?: string;
}
