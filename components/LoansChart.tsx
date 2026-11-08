"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { mes: "Nov", prestamos: 12, ingresos: 4800 },
  { mes: "Dic", prestamos: 18, ingresos: 7200 },
  { mes: "Ene", prestamos: 15, ingresos: 6100 },
  { mes: "Feb", prestamos: 22, ingresos: 8900 },
  { mes: "Mar", prestamos: 19, ingresos: 7600 },
  { mes: "Abr", prestamos: 25, ingresos: 10200 },
];

export default function LoansChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="mes"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
            }}
          />
          <Bar dataKey="prestamos" name="Préstamos" fill="#2563eb" radius={[6, 6, 0, 0]} />
          <Bar dataKey="ingresos" name="Ingresos" fill="#94a3b8" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}