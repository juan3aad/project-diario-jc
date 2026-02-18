"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
  Cell,
} from "recharts"

interface WorriesChartProps {
  data: Array<{
    name: string
    value: number
  }>
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4242",
  "#8884d8",
]

export function WorriesChart({ data }: WorriesChartProps) {
  const hasData = data && data.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Preocupaciones</CardTitle>
        <CardDescription>Temas más frecuentes en tus entradas del diario.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {hasData ? (
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }} // Increased left margin
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={120} // Increased width for labels
                interval={0}
              />
              <Tooltip
                wrapperStyle={{ zIndex: 1000 }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
                formatter={(value) => [value, "Entradas"]}
              />
              <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No hay suficientes datos para mostrar la gráfica.
            </div>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
