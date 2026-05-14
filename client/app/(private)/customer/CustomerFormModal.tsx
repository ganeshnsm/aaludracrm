"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import {
    createCustomerAction,
    updateCustomerAction,
} from "@/app/actions/customers";
import type {
    Customer,
    CreateCustomerInput,
} from "@/lib/customer-types";

const schema = z.object({
    name: z.string().trim().min(1, "Name is required").max(120),
    email: z.string().trim().email("Invalid email").max(180),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    company: z.string().trim().max(160).optional().or(z.literal("")),
    status: z.enum(["lead", "active", "inactive"]),
});

type FormValues = z.infer<typeof schema>;

interface CustomerFormModalProps {
    open: boolean;
    onClose: () => void;
    customer?: Customer;
}

function emptyToUndefined(v: string | undefined): string | undefined {
    if (!v) return undefined;
    const trimmed = v.trim();
    return trimmed === "" ? undefined : trimmed;
}

function defaultsFrom(customer?: Customer): FormValues {
    if (!customer) {
        return { name: "", email: "", phone: "", company: "", status: "lead" };
    }
    return {
        name: customer.name,
        email: customer.email,
        phone: customer.phone ?? "",
        company: customer.company ?? "",
        status: customer.status,
    };
}

export default function CustomerFormModal({
    open,
    onClose,
    customer,
}: CustomerFormModalProps) {
    const queryClient = useQueryClient();
    const isEdit = Boolean(customer);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: defaultsFrom(customer),
    });

    useEffect(() => {
        reset(defaultsFrom(customer));
    }, [customer, reset]);

    const mutation = useMutation({
        mutationFn: async (values: FormValues) => {
            const payload: CreateCustomerInput = {
                name: values.name.trim(),
                email: values.email.trim(),
                phone: emptyToUndefined(values.phone),
                company: emptyToUndefined(values.company),
                status: values.status,
            };
            return customer
                ? updateCustomerAction(customer.id, payload)
                : createCustomerAction(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            queryClient.invalidateQueries({ queryKey: ["customer-stats"] });
            onClose();
        },
    });

    useEffect(() => {
        if (!open) {
            reset(defaultsFrom(customer));
            mutation.reset();
        }
        // mutation intentionally omitted to avoid loop; reset is stable
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const onSubmit = handleSubmit((values) => mutation.mutate(values));

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={isEdit ? "Edit Customer" : "New Customer"}
        >
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                {mutation.error && (
                    <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {mutation.error.message}
                    </div>
                )}

                <Input
                    label="Name"
                    autoFocus
                    {...register("name")}
                    error={errors.name?.message}
                />
                <Input
                    label="Email"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                />
                <Input
                    label="Phone"
                    {...register("phone")}
                    error={errors.phone?.message}
                />
                <Input
                    label="Company"
                    {...register("company")}
                    error={errors.company?.message}
                />
                <Select
                    label="Status"
                    {...register("status")}
                    error={errors.status?.message}
                >
                    <option value="lead">Lead</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </Select>

                <div className="mt-2 flex items-center justify-end gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={mutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending && (
                            <Spinner className="mr-2 border-zinc-500 border-t-white" />
                        )}
                        {isEdit ? "Save" : "Create"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
