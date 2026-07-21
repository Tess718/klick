"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

type ClickByDay = { day: string; count: number | bigint };
type GroupedCount<K extends string> = { _count: number } & Record<K, string | null>;

export function ClicksOverTimeChart({ data }: { data: ClickByDay[] }) {
  const chartData = data.map((d) => ({
    day: new Date(d.day).toLocaleDateString(),
    count: Number(d.count),
  }));

  return (
    <div>
      <p>Clicks over time</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData}>
          <XAxis dataKey="day" fontSize={12} />
          <YAxis fontSize={12} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#378ADD" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DeviceBreakdownChart({ data }: { data: GroupedCount<"device">[] }) {
  const chartData = data.map((d) => ({
    device: d.device ?? "unknown",
    count: d._count,
  }));

  return (
    <div>
      <p>Device breakdown</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <XAxis dataKey="device" fontSize={12} />
          <YAxis fontSize={12} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#1D9E75" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CountryBreakdownChart({ data }: { data: GroupedCount<"country">[] }) {
  const chartData = data
    .map((d) => ({
      country: d.country ?? "unknown",
      count: d._count,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div>
      <p>Country breakdown</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} layout="vertical">
          <XAxis type="number" fontSize={12} allowDecimals={false} />
          <YAxis type="category" dataKey="country" fontSize={12} width={60} />
          <Tooltip />
          <Bar dataKey="count" fill="#D85A30" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
