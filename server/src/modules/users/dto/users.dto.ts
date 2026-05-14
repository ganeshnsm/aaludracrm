import { Type } from "class-transformer";
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";

export class UserDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    last_name: string | null;

    @IsOptional()
    @IsString()
    profile_url?: string | null;

    @IsOptional()
    @IsString()
    availability_status?: string | null;

    @IsOptional()
    @IsNumber()
    lastseen?: number | null;

    @IsOptional()
    @IsNumber()
    created_at?: number;

    @IsOptional()
    @IsString()
    translation_language?: string | null;
}