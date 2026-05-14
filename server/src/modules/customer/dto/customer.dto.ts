import {
    IsEmail,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
} from "class-validator";

export class CreateCustomerDto {
    @IsString()
    @MaxLength(100)
    name: string;

    @IsEmail()
    @MaxLength(150)
    email: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    company?: string;

    @IsOptional()
    @IsInt()
    company_id?: number;
}

export class UpdateCustomerDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(150)
    email?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    company?: string;

    @IsOptional()
    @IsInt()
    company_id?: number;
}
