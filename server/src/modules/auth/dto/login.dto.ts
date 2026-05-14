import {
    IsString,
    IsEmail,
    MinLength,
    IsNumber,
    IsOptional,
    IsInt,
    IsBoolean,
} from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: "Invalid Email" })
    email: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @IsOptional()
    @IsBoolean()
    rememberMe?: boolean;

    @IsOptional()
    @IsNumber()
    invited_company?: number;
}