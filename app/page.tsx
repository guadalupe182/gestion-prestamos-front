export const instant = false;

import StatCard from "@/components/StatCard";
import LicenseGuard from "@/components/LicenseGuard";
import LoansChart from "@/components/LoansChart";
import { apiFetch } from "@/lib/api";

type DashboardStats = {
  totalPrestado: number;
  totalCobrado: number;
  prestamosActivos: number;
  clientes: number;
};

async function getStats(): Promise<DashboardStats> {
  try {
    return await apiFetch<DashboardStats>("/dashboard");
  } catch {
    return {
      totalPrestado: 0,
      totalCobrado: 0,
      prestamosActivos: 0,
      clientes: 0,
    };
  }
}

const money = (value: number) =>
  `$ ${value.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;

export default async function Home() {
  const stats = await getStats();

  return (
    <LicenseGuard>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Resumen general del sistema de préstamos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Prestado"
          value={money(stats.totalPrestado)}
          hint="Monto total otorgado"
          accent="blue"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Cobrado"
          value={money(stats.totalCobrado)}
          hint="Pagos recibidos"
          accent="emerald"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Préstamos Activos"
          value={stats.prestamosActivos.toLocaleString("es-CO")}
          hint="En curso"
          accent="blue"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
          }
        />
        <StatCard
          title="Clientes"
          value={stats.clientes.toLocaleString("es-CO")}
          hint="Registrados"
          accent="slate"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
        />
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Actividad reciente
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Préstamos e ingresos de los últimos 6 meses.
        </p>
        <div className="mt-4">
          <LoansChart />
        </div>
      </div>
    </div>
    </LicenseGuard>
  );
}