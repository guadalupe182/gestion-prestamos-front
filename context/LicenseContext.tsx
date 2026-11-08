"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const LICENSE_STORAGE_KEY = "gestion_prestamos_license_key";
const LICENSE_EXPIRATION_KEY = "gestion_prestamos_license_expiration";

const LICENSE_VALIDATION_URL =
  process.env.NEXT_PUBLIC_LICENSE_VALIDATION_URL ??
  "https://api.gdevsoftware.com/api/v1/licenses/validate";

interface LicenseApiResponse {
  plan?: string;
  expiresAt?: string;
  expirationDate?: string;
  expiryDate?: string;
  valid?: boolean;
}

export interface LicenseDetails {
  key: string;
  plan: string;
  expirationDate: string | null;
}

type LicenseContextValue = {
  license: LicenseDetails | null;
  loading: boolean;
  error: string;
  isValid: boolean;
  isExpired: boolean;
  validateLicense: (rawKey: string) => Promise<void>;
  clearLicense: () => void;
};

const LicenseContext = createContext<LicenseContextValue | undefined>(undefined);

function isExpiredDate(value: string | null): boolean {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() < Date.now();
}

export function LicenseProvider({ children }: { children: React.ReactNode }) {
  const [license, setLicense] = useState<LicenseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const validateLicense = useCallback(async (rawKey: string) => {
    const normalizedKey = rawKey.trim().toUpperCase();

    if (!normalizedKey) {
      setError("Ingresa tu llave de licencia.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${LICENSE_VALIDATION_URL}/${encodeURIComponent(normalizedKey)}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        },
      );

      if (response.status === 403 || response.status === 404) {
        window.localStorage.removeItem(LICENSE_STORAGE_KEY);
        window.localStorage.removeItem(LICENSE_EXPIRATION_KEY);
        setLicense(null);
        setError("Licencia inválida o expirada.");
        return;
      }

      if (!response.ok) {
        setError("No fue posible validar la licencia. Inténtalo de nuevo más tarde.");
        return;
      }

      const data = (await response.json()) as LicenseApiResponse;
      const expirationDate =
        data.expiresAt || data.expirationDate || data.expiryDate || null;

      if (expirationDate && isExpiredDate(expirationDate)) {
        window.localStorage.removeItem(LICENSE_STORAGE_KEY);
        window.localStorage.removeItem(LICENSE_EXPIRATION_KEY);
        setLicense(null);
        setError("Licencia expirada.");
        return;
      }

      const details: LicenseDetails = {
        key: normalizedKey,
        plan: data.plan || "No especificado",
        expirationDate,
      };

      window.localStorage.setItem(LICENSE_STORAGE_KEY, normalizedKey);
      if (expirationDate) {
        window.localStorage.setItem(LICENSE_EXPIRATION_KEY, expirationDate);
      } else {
        window.localStorage.removeItem(LICENSE_EXPIRATION_KEY);
      }

      setLicense(details);
    } catch {
      setError("No fue posible conectar con el servicio de licencias. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedKey = window.localStorage.getItem(LICENSE_STORAGE_KEY);
    const savedExpiration = window.localStorage.getItem(LICENSE_EXPIRATION_KEY);

    if (savedKey) {
      if (savedExpiration && isExpiredDate(savedExpiration)) {
        window.localStorage.removeItem(LICENSE_STORAGE_KEY);
        window.localStorage.removeItem(LICENSE_EXPIRATION_KEY);
        setLicense(null);
        setLoading(false);
        return;
      }

      setLicense({
        key: savedKey,
        plan: "No especificado",
        expirationDate: savedExpiration,
      });

      void validateLicense(savedKey);
    } else {
      setLoading(false);
    }
  }, [validateLicense]);

  const clearLicense = useCallback(() => {
    window.localStorage.removeItem(LICENSE_STORAGE_KEY);
    window.localStorage.removeItem(LICENSE_EXPIRATION_KEY);
    setLicense(null);
    setError("");
  }, []);

  const expired = isExpiredDate(license?.expirationDate ?? null);

  const value = useMemo(
    () => ({
      license,
      loading,
      error,
      isValid: !!license && !expired,
      isExpired: expired,
      validateLicense,
      clearLicense,
    }),
    [license, loading, error, expired, validateLicense, clearLicense],
  );

  return (
    <LicenseContext.Provider value={value}>{children}</LicenseContext.Provider>
  );
}

export function useLicense(): LicenseContextValue {
  const ctx = useContext(LicenseContext);
  if (!ctx) {
    throw new Error("useLicense debe usarse dentro de LicenseProvider");
  }
  return ctx;
}