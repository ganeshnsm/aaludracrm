"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { deleteCustomerAction } from "@/app/actions/customers";
import type { Customer } from "@/lib/customer-types";

interface DeleteConfirmModalProps {
    open: boolean;
    onClose: () => void;
    customer: Customer | null;
}

export default function DeleteConfirmModal({
    open,
    onClose,
    customer,
}: DeleteConfirmModalProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            if (!customer) throw new Error("No customer selected");
            return deleteCustomerAction(customer.id);
        },
        onMutate: async () => {
            if (!customer) return { snapshots: [] as [unknown, unknown][] };
            await queryClient.cancelQueries({ queryKey: ["customers"] });
            const snapshots = queryClient.getQueriesData({ queryKey: ["customers"] });
            queryClient.setQueriesData(
                { queryKey: ["customers"] },
                (old: Customer[] | undefined) =>
                    old?.filter((c) => c.id !== customer.id) ?? [],
            );
            return { snapshots };
        },
        onError: (_err, _vars, ctx) => {
            ctx?.snapshots.forEach(([key, data]) => {
                queryClient.setQueryData(key as readonly unknown[], data);
            });
        },
        onSuccess: () => {
            onClose();
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            queryClient.invalidateQueries({ queryKey: ["customer-stats"] });
        },
    });

    useEffect(() => {
        if (!open) mutation.reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    if (!customer) return null;

    return (
        <Modal open={open} onClose={onClose} title="Delete Customer">
            <div className="flex flex-col gap-4">
                {mutation.error && (
                    <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {mutation.error.message}
                    </div>
                )}

                <p className="text-sm text-zinc-700">
                    Delete <strong>{customer.name}</strong>? This action cannot be undone.
                </p>

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
                        type="button"
                        variant="danger"
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending && (
                            <Spinner className="mr-2 border-red-300 border-t-white" />
                        )}
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
