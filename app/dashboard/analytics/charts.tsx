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
  CartesianGrid,
} from "recharts";

type ClickByDay = { day: string; count: number | bigint };
type GroupedCount<K extends string> = { _count: number } & Record<K, string | null>;

export function GlobalClicksChart({ data }: { data: ClickByDay[] }) {
  const chartData = data.map((d) => ({
    day: new Date(d.day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    clicks: Number(d.count),
  }));

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Clicks Over Time</h3>
      {chartData.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-zinc-400">No click data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="day" fontSize={12} tick={{ fill: "#71717a" }} />
            <YAxis fontSize={12} allowDecimals={false} tick={{ fill: "#71717a" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }}
              labelStyle={{ color: "#a1a1aa" }}
              itemStyle={{ color: "#3b82f6" }}
            />
            <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function BreakdownChart({
  data,
  dataKey,
  title,
  color = "#3b82f6",
}: {
  data: GroupedCount<string>[];
  dataKey: string;
  title: string;
  color?: string;
}) {
  const chartData = data
    .map((d) => ({
      name: (d as Record<string, unknown>)[dataKey] as string ?? "Unknown",
      count: d._count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {chartData.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-zinc-400">No data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
            <XAxis type="number" fontSize={12} allowDecimals={false} tick={{ fill: "#71717a" }} />
            <YAxis type="category" dataKey="name" fontSize={12} width={80} tick={{ fill: "#a1a1aa" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }}
              labelStyle={{ color: "#a1a1aa" }}
              itemStyle={{ color }}
            />
            <Bar dataKey="count" fill={color} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
