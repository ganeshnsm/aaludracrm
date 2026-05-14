import "server-only";
import { apiFetch } from "./api";
import type {
    Customer,
    CustomerStats,
    CreateCustomerInput,
    ListParams,
    UpdateCustomerInput,
} from "./customer-types";

export type {
    Customer,
    CustomerStats,
    CustomerStatus,
    CreateCustomerInput,
    ListParams,
    UpdateCustomerInput,
} from "./customer-types";

function qs(p: Record<string, unknown>): string {
    const parts: string[] = [];
    for (const [key, value] of Object.entries(p)) {
        if (value === undefined || value === null) continue;
        const str = String(value);
        if (str === "") continue;
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(str)}`);
    }
    return parts.join("&");
}

export const listCustomers = (p: ListParams = {}) => {
    const query = qs({ ...p });
    return apiFetch<Customer[]>(`/customers${query ? `?${query}` : ""}`);
};

export const getCustomer = (id: number) =>
    apiFetch<Customer>(`/customers/${id}`);

export const getStats = () => apiFetch<CustomerStats>(`/customers/stats`);

export const createCustomer = (input: CreateCustomerInput) =>
    apiFetch<Customer>(`/customers`, { method: "POST", body: input });

export const updateCustomer = (id: number, input: UpdateCustomerInput) =>
    apiFetch<Customer>(`/customers/${id}`, { method: "PATCH", body: input });

export const deleteCustomer = (id: number) =>
    apiFetch<{ success: true }>(`/customers/${id}`, { method: "DELETE" });
