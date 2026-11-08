"use client";

import { FormEvent, useState } from "react";
import { useLicense } from "@/context/LicenseContext";

export default function LicenciaPage() {
  const { license, loading, error, isValid, validateLicense, clearLicense } =
    useLicense();
  const [licenseKey, setLicenseKey] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void validateLicense(licenseKey);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Licencia</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ingresa y valida tu llave de licencia para habilitar el sistema.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="licenseKey"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Llave de licencia
            </label>
            <input
              id="licenseKey"
              type="text"
              value={licenseKey}
              onChange={(event) => setLicenseKey(event.target.value)}
              placeholder="GDEV-XXXX"
              autoComplete="off"
              spellCheck={false}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 font-mono text-sm uppercase text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !licenseKey.trim()}
            className="w-full rounded-xl bg-blue-600 p-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
          >
            {loading ? "Validando licencia..." : "Validar licencia"}
          </button>
        </form>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700"
          >
            {error}
          </div>
        )}

        {license && !loading && isValid && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-bold text-emerald-700">
              Licencia activa
            </p>
            <p className="mt-1 text-xs text-emerald-600">
              Plan: {license.plan}
              {license.expirationDate
                ? ` · Expira: ${new Date(license.expirationDate).toLocaleDateString("es-MX")}`
                : ""}
            </p>
            <button
              type="button"
              onClick={clearLicense}
              className="mt-3 text-xs font-medium text-emerald-700 underline"
            >
              Quitar licencia
            </button>
          </div>
        )}
      </section>
    </div>
  );
}