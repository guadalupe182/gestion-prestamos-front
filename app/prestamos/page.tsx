"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { exportToExcel } from "@/lib/excel";
import type { Loan, LoanStatus } from "@/lib/types";

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrestamos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Loan[]>("/api/loans");
      setPrestamos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar préstamos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPrestamos();
  }, []);

  const handleExport = () => {
    const rows = prestamos.map((prestamo) => ({
      id: prestamo.id,
      clientId: prestamo.clientId,
      amount: prestamo.amount,
      interestRate: prestamo.interestRate,
      startDate: prestamo.startDate,
      endDate: prestamo.endDate ?? "",
      status: prestamo.status,
      tenantId: prestamo.tenantId,
      totalToPay: prestamo.totalToPay,
    }));
    exportToExcel(rows, "prestamos.xlsx", "Prestamos");
  };

  const money = (value: number) =>
    `$ ${value.toLocaleString("es-CO", { minimumFractionDigits: 2 })}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Préstamos</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestión de préstamos registrados en el sistema.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Exportar a Excel
          </button>
          <button
            type="button"
            onClick={() => void loadPrestamos()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Actualizar
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Cliente</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Monto</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Tasa</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Inicio</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Fin</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Estado</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Total a pagar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prestamos.map((prestamo) => (
                <tr key={prestamo.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {prestamo.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{prestamo.clientId.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {money(prestamo.amount)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {(prestamo.interestRate * 100).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3 text-slate-700">{prestamo.startDate}</td>
                  <td className="px-4 py-3 text-slate-700">{prestamo.endDate ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        prestamo.status === "PAID"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {prestamo.status === "PAID" ? "Pagado" : "Activo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">
                    {money(prestamo.totalToPay)}
                  </td>
                </tr>
              ))}
              {prestamos.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    No hay préstamos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}