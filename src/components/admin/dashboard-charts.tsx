"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ORANGE = "#f18a00";
const PIE_COLORS = ["#f18a00", "#f39200", "#ed6e1e", "#fcc00d", "#ef7d16"];
const axisTick = { fill: "rgba(255,255,255,0.4)", fontSize: 12 };
const tooltipStyle = {
  background: "#010101",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  color: "#ffffff",
};

type Props = {
  topProducts: { name: string; cantidad: number }[];
  categoryData: { name: string; value: number }[];
  dailySales: { dia: string; ventas: number }[];
};

export function DashboardCharts({
  topProducts,
  categoryData,
  dailySales,
}: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Ventas de los últimos 7 días" wide>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={dailySales}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="dia"
              tick={axisTick}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={axisTick}
              tickLine={false}
              axisLine={false}
              width={44}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ stroke: ORANGE, strokeOpacity: 0.25 }}
            />
            <Line
              type="monotone"
              dataKey="ventas"
              stroke={ORANGE}
              strokeWidth={3}
              dot={{ fill: ORANGE, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Productos más vendidos">
        {topProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topProducts}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={axisTick}
                tickLine={false}
                axisLine={false}
                interval={0}
              />
              <YAxis
                tick={axisTick}
                tickLine={false}
                axisLine={false}
                width={32}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "rgba(241,138,0,0.08)" }}
              />
              <Bar dataKey="cantidad" fill={ORANGE} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Empty />
        )}
      </ChartCard>

      <ChartCard title="Ventas por categoría">
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Empty />
        )}
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  wide,
  children,
}: {
  title: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 ${
        wide ? "lg:col-span-2" : ""
      }`}
    >
      <h3 className="mb-4 font-heading font-bold text-guzzo-white">{title}</h3>
      {children}
    </div>
  );
}

function Empty() {
  return (
    <div className="flex h-[260px] items-center justify-center text-sm text-white/30">
      Sin datos todavía.
    </div>
  );
}
