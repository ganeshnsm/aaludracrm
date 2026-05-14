import StatsCards from "./StatsCards";

export default function DashboardPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <StatsCards />
        </div>
    );
}
