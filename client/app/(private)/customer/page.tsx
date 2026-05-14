import { requireUser } from "@/lib/dal";

export default async function Customer() {
    const user = await requireUser();

    return (
        <section className="p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-black">Customer Management</h1>
                <button className="rounded bg-black px-3 py-1.5 text-sm text-white hover:bg-zinc-800">
                    Create new User
                </button>
            </div>
            <p className="mt-2 text-zinc-600">
                Welcome, {user.name}. Your customer list will live here.
            </p>
        </section>
    );
}
