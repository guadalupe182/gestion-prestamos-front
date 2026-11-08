"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { exportToExcel, parseExcelFile } from "@/lib/excel";
import type { Cliente, CreateClienteRequest, TipoCliente } from "@/lib/types";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [previewRows, setPreviewRows] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState<CreateClienteRequest>({
    nombre: "",
    email: "",
    edad: 18,
    tipoCliente: "REGULAR",
  });

  const loadClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Cliente[]>("/api/v1/clientes");
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Se requiere iniciar sesión");
      } else {
        setError(err instanceof Error ? err.message : "Error al cargar clientes");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const handleExport = () => {
    const rows = clientes.map((cliente) => ({
      id: cliente.id,
      nombre: cliente.nombre,
      email: cliente.email,
      edad: cliente.edad,
      tipoCliente: cliente.tipoCliente,
    }));
    exportToExcel(rows, "clientes.xlsx", "Clientes");
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseExcelFile(file);
      setPreviewRows(rows);
    } catch {
      setError("No fue posible leer el archivo Excel.");
    } finally {
      event.target.value = "";
    }
  };

  const handleImportConfirm = async () => {
    if (previewRows.length === 0) return;
    setImporting(true);
    setError(null);
    try {
      for (const row of previewRows) {
        await apiFetch<Cliente>("/api/v1/clientes", {
          method: "POST",
          body: JSON.stringify({
            nombre: String(row.nombre ?? row.Nombre ?? ""),
            email: String(row.email ?? row.Email ?? ""),
            edad: Number(row.edad ?? row.Edad ?? 18),
            tipoCliente: String(row.tipoCliente ?? row.TipoCliente ?? "REGULAR"),
          }),
        });
      }
      setPreviewRows([]);
      await loadClientes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al importar clientes");
    } finally {
      setImporting(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiFetch<Cliente>("/api/v1/clientes", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setShowModal(false);
      setForm({ nombre: "", email: "", edad: 18, tipoCliente: "REGULAR" });
      await loadClientes();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Se requiere iniciar sesión");
      } else {
        setError(err instanceof Error ? err.message : "Error al crear cliente");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestión de clientes registrados en el sistema.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            + Nuevo Cliente
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Exportar a Excel
          </button>
          <label className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            Importar Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {previewRows.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-amber-800">
              Vista previa de importación ({previewRows.length} filas)
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPreviewRows([])}
                className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleImportConfirm}
                disabled={importing}
                className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-500 disabled:opacity-60"
              >
                {importing ? "Importando..." : "Confirmar importación"}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-left text-amber-900">
                  {Object.keys(previewRows[0]).map((key) => (
                    <th key={key} className="px-2 py-1 font-semibold">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.slice(0, 5).map((row, index) => (
                  <tr key={index} className="border-t border-amber-200">
                    {Object.keys(previewRows[0]).map((key) => (
                      <td key={key} className="px-2 py-1 text-amber-900">
                        {String(row[key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          </div>
        ) : clientes.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500">
            No hay clientes registrados.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Edad
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tipo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {clientes.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {c.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{c.edad}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        c.tipoCliente === "VIP"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {c.tipoCliente}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              Nuevo Cliente
            </h2>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Nombre
                </label>
                <input
                  required
                  value={form.nombre}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nombre: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Edad
                  </label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={form.edad}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, edad: Number(e.target.value) }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Tipo
                  </label>
                  <select
                    value={form.tipoCliente}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        tipoCliente: e.target.value as TipoCliente,
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="REGULAR">REGULAR</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}