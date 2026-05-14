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
import {
    CreateCustomerDto,
    ListCustomersQueryDto,
    UpdateCustomerDto,
} from "./dto/customer.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { User } from "../../database/entities/user.entity";

@UseGuards(JwtAuthGuard)
@Controller("customers")
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Get()
    findAll(
        @CurrentUser() user: User,
        @Query() query: ListCustomersQueryDto,
    ) {
        return this.customerService.findAll(user.id, query);
    }

    @Get("stats")
    stats(@CurrentUser() user: User) {
        return this.customerService.stats(user.id);
    }

    @Get(":id")
    findOne(
        @CurrentUser() user: User,
        @Param("id", ParseIntPipe) id: number,
    ) {
        return this.customerService.findOne(user.id, id);
    }

    @Post()
    create(@CurrentUser() user: User, @Body() dto: CreateCustomerDto) {
        return this.customerService.create(user.id, dto);
    }

    @Patch(":id")
    update(
        @CurrentUser() user: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateCustomerDto,
    ) {
        return this.customerService.update(user.id, id, dto);
    }

    @Delete(":id")
    remove(
        @CurrentUser() user: User,
        @Param("id", ParseIntPipe) id: number,
    ) {
        return this.customerService.remove(user.id, id);
    }
}
