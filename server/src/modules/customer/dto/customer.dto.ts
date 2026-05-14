import { PartialType } from "@nestjs/mapped-types";
import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";

export enum CustomerStatus {
    LEAD = "lead",
    ACTIVE = "active",
    INACTIVE = "inactive",
}

export class CreateCustomerDto {
    @IsString()
    @MinLength(1)
    @MaxLength(120)
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @MaxLength(40)
    phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(160)
    company?: string;

    @IsOptional()
    @IsEnum(CustomerStatus)
    status?: CustomerStatus;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}

export class ListCustomersQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(CustomerStatus)
    status?: CustomerStatus;
}
