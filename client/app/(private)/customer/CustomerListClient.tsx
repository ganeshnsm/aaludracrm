"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Badge, Button, Spinner } from "@/components/ui";
import type { Customer, CustomerStatus } from "@/lib/customer-types";
import { listCustomersAction } from "@/app/actions/customers";
import { highlight } from "@/lib/highlight";
import { SearchBar } from "./SearchBar";
import { StatusFilter, type StatusFilterValue } from "./StatusFilter";
import { PerfBadge } from "./PerfBadge";
import CustomerFormModal from "./CustomerFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

const COLUMN_TEMPLATE = "grid-cols-[2fr_2fr_1.5fr_1.5fr_120px_140px]";
const ROW_HEIGHT = 56;

export default function CustomerListClient() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<StatusFilterValue>("all");
    const [editing, setEditing] = useState<Customer | null>(null);
    const [deleting, setDeleting] = useState<Customer | null>(null);
    const [creating, setCreating] = useState(false);

    const [debouncedSearch] = useDebounce(search, 250);

    const queryStartRef = useRef<number>(0);
    queryStartRef.current = queryStartRef.current || performance.now();

    const query = useQuery({
        queryKey: ["customers", { search: debouncedSearch, status }],
        queryFn: async () => {
            queryStartRef.current = performance.now();
            return listCustomersAction({
                search: debouncedSearch || undefined,
                status: status === "all" ? undefined : (status as CustomerStatus),
            });
        },
        placeholderData: (prev) => prev,
    });

    const rows = useMemo(() => query.data ?? [], [query.data]);

    const [queryMs, setQueryMs] = useState(0);
    const [renderMs, setRenderMs] = useState(0);
    const renderMarkRef = useRef<number>(0);

    useEffect(() => {
        if (query.isFetching) {
            renderMarkRef.current = performance.now();
            return;
        }
        if (query.dataUpdatedAt && renderMarkRef.current) {
            setQueryMs(performance.now() - queryStartRef.current);
        }
    }, [query.isFetching, query.dataUpdatedAt]);

    useEffect(() => {
        if (renderMarkRef.current) {
            setRenderMs(performance.now() - renderMarkRef.current);
            renderMarkRef.current = 0;
        }
    }, [rows]);

    const parentRef = useRef<HTMLDivElement | null>(null);
    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: 10,
    });

    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    const showInitialSpinner = query.isPending;
    const showEmpty = !query.isPending && !query.isError && rows.length === 0;

    return (
        <section className="flex flex-1 flex-col">
            <div className="border-b border-zinc-200 bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-black">Customers</h1>
                </div>
            </div>

            <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-6 py-3">
                <SearchBar value={search} onChange={setSearch} />
                <StatusFilter value={status} onChange={setStatus} />
                <Button variant="primary" onClick={() => setCreating(true)}>
                    + New Customer
                </Button>
            </div>

            {query.isError && (
                <div className="mx-6 mt-4 flex items-center justify-between rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <span>{(query.error as Error)?.message ?? "Failed to load customers"}</span>
                    <Button variant="secondary" size="sm" onClick={() => query.refetch()}>
                        Retry
                    </Button>
                </div>
            )}

            <div className="relative flex-1 px-6 pb-6">
                {showInitialSpinner && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60">
                        <Spinner className="h-6 w-6" />
                    </div>
                )}

                <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200 bg-white">
                    <div
                        ref={parentRef}
                        className="overflow-auto"
                        style={{ height: "calc(100vh - 240px)" }}
                    >
                        <div
                            className={`sticky top-0 z-10 grid ${COLUMN_TEMPLATE} border-b border-zinc-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-zinc-600`}
                        >
                            <div>Name</div>
                            <div>Email</div>
                            <div>Phone</div>
                            <div>Company</div>
                            <div>Status</div>
                            <div className="text-right">Actions</div>
                        </div>

                        {showEmpty ? (
                            <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
                                No customers match these filters
                            </div>
                        ) : (
                            <div
                                style={{
                                    height: totalSize,
                                    position: "relative",
                                    width: "100%",
                                }}
                            >
                                {virtualItems.map((virtualRow) => {
                                    const row = rows[virtualRow.index];
                                    if (!row) return null;
                                    return (
                                        <div
                                            key={row.id}
                                            data-index={virtualRow.index}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: virtualRow.size,
                                                transform: `translateY(${virtualRow.start}px)`,
                                            }}
                                            className={`grid ${COLUMN_TEMPLATE} items-center border-b border-zinc-100 px-4 text-sm text-zinc-800 hover:bg-zinc-50`}
                                        >
                                            <div className="truncate font-medium">
                                                {highlight(row.name, debouncedSearch)}
                                            </div>
                                            <div className="truncate text-zinc-600">
                                                {highlight(row.email, debouncedSearch)}
                                            </div>
                                            <div className="truncate text-zinc-600">
                                                {row.phone ?? "—"}
                                            </div>
                                            <div className="truncate text-zinc-600">
                                                {row.company ?? "—"}
                                            </div>
                                            <div>
                                                <Badge status={row.status} />
                                            </div>
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    type="button"
                                                    aria-label={`Edit ${row.name}`}
                                                    onClick={() => setEditing(row)}
                                                    className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="h-4 w-4"
                                                    >
                                                        <path d="M2.695 14.762l-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label={`Delete ${row.name}`}
                                                    onClick={() => setDeleting(row)}
                                                    className="rounded p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="h-4 w-4"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CustomerFormModal
                open={creating || !!editing}
                onClose={() => {
                    setCreating(false);
                    setEditing(null);
                }}
                customer={editing ?? undefined}
            />
            <DeleteConfirmModal
                open={!!deleting}
                onClose={() => setDeleting(null)}
                customer={deleting}
            />

            <PerfBadge rowCount={rows.length} renderMs={renderMs} queryMs={queryMs} />
        </section>
    );
}
