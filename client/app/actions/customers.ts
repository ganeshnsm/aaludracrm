"use server";

import type { ApiError } from "@/lib/api";
import {
    listCustomers,
    getCustomer,
    getStats,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from "@/lib/customers";
import type {
    Customer,
    CustomerStats,
    CreateCustomerInput,
    ListParams,
    UpdateCustomerInput,
} from "@/lib/customer-types";

function rethrow(err: unknown): never {
    if (typeof err === "object" && err !== null && "message" in err) {
        const e = err as ApiError;
        throw new Error(e.message || "Request failed");
    }
    throw new Error("Request failed");
}

export async function listCustomersAction(params: ListParams = {}): Promise<Customer[]> {
    try {
        return await listCustomers(params);
    } catch (err) {
        rethrow(err);
    }
}

export async function getCustomerAction(id: number): Promise<Customer> {
    try {
        return await getCustomer(id);
    } catch (err) {
        rethrow(err);
    }
}

export async function getStatsAction(): Promise<CustomerStats> {
    try {
        return await getStats();
    } catch (err) {
        rethrow(err);
    }
}

export async function createCustomerAction(input: CreateCustomerInput): Promise<Customer> {
    try {
        return await createCustomer(input);
    } catch (err) {
        rethrow(err);
    }
}

export async function updateCustomerAction(
    id: number,
    input: UpdateCustomerInput,
): Promise<Customer> {
    try {
        return await updateCustomer(id, input);
    } catch (err) {
        rethrow(err);
    }
}

export async function deleteCustomerAction(id: number): Promise<{ success: true }> {
    try {
        return await deleteCustomer(id);
    } catch (err) {
        rethrow(err);
    }
}
