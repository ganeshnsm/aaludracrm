import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";

import { CustomerService } from "./customer.service";
import { CreateCustomerDto, UpdateCustomerDto } from "./dto/customer.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("customers")
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Post()
    create(@Body() dto: CreateCustomerDto) {
        return this.customerService.create(dto);
    }

    @Get()
    findAll(@Query("company_id") companyId?: string) {
        const parsed = companyId ? parseInt(companyId, 10) : undefined;
        return this.customerService.findAll(
            Number.isFinite(parsed) ? parsed : undefined,
        );
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.customerService.findOne(id);
    }

    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateCustomerDto,
    ) {
        return this.customerService.update(id, dto);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.customerService.remove(id);
    }
}
