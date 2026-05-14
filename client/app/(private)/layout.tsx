import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { logoutAction } from "@/app/actions/auth";

export default async function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireUser();

    return (
        <div className="flex min-h-full flex-col">
            <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
                <nav className="flex items-center gap-6 text-sm">
                    <Link
                        href="/dashboard"
                        className="font-medium text-zinc-700 hover:text-black"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/customer"
                        className="font-medium text-zinc-700 hover:text-black"
                    >
                        Customers
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-zinc-700">
                        Signed in as <span className="font-medium">{user.name}</span> ({user.email})
                    </div>
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="rounded border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50"
                        >
                            Log out
                        </button>
                    </form>
                </div>
            </header>
            <main className="flex flex-1 flex-col">{children}</main>
        </div>
    );
}
