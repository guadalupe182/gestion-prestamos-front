"use client";

import Link from "next/link";
import { useLicense } from "@/context/LicenseContext";

export default function LicenseGuard({ children }: { children: React.ReactNode }) {
  const { loading, isValid, isExpired } = useLicense();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-rose-200 bg-white p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-2xl text-rose-600">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Función Bloqueada</h1>
          <p className="mt-2 text-sm text-slate-500">
            {isExpired
              ? "Tu licencia ha expirado. Renueva tu licencia para continuar usando el sistema."
              : "Se requiere una licencia válida para acceder al dashboard y a los datos."}
          </p>
          <Link
            href="/licencia"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Ir a validar licencia
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}