// Tipos alineados con el backend (gestion-prestamos-api).

export type TipoCliente = "REGULAR" | "VIP";

export type EstadoPrestamo = "PENDIENTE" | "PAGADO";

export type LoanStatus = "ACTIVE" | "PAID";

// Cliente del flujo en memoria (/api/v1/clientes)
export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  edad: number;
  tipoCliente: TipoCliente;
}

export interface CreateClienteRequest {
  nombre: string;
  email: string;
  edad: number;
  tipoCliente: TipoCliente;
}

// Client del flujo JPA (/api/loans)
export interface Client {
  id: string; // UUID
  name: string;
  email: string;
}

export interface Loan {
  id: string; // UUID
  clientId: string; // UUID
  amount: number;
  interestRate: number;
  startDate: string; // ISO date
  endDate?: string | null;
  status: LoanStatus;
  tenantId: string;
  totalToPay: number;
}

export interface LoanRequest {
  clientId: string;
  amount: number;
  interestRate?: number;
  startDate?: string;
  endDate?: string;
  status?: LoanStatus;
  tenantId: string;
}

export interface Payment {
  id: string; // UUID
  loanId: string; // UUID
  amount: number;
  paymentDate: string; // ISO date
  createdAt: string; // ISO datetime
}

export interface PaymentRequest {
  amount: number;
  paymentDate?: string;
}

// Auth
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  licenseKey: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  expiresIn: number;
}