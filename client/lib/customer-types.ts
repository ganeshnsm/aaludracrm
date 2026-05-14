export type CustomerStatus = "lead" | "active" | "inactive";

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    status: CustomerStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerStats {
    total: number;
    active: number;
    inactive: number;
    lead: number;
}

export interface ListParams {
    search?: string;
    status?: CustomerStatus;
}

export interface CreateCustomerInput {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    status?: CustomerStatus;
}

export type UpdateCustomerInput = Partial<CreateCustomerInput>;
