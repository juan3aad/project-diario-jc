"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface StressChartProps {
  data: Array<{ date: string; value: number }>
}

export function StressChart({ data }: StressChartProps) {
  // Formatear datos para el gráfico
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
    stress: item.value,
  }))

  const chartConfig = {
    stress: {
      label: "Nivel de Estrés",
      color: "hsl(var(--chart-1))",
    },
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">No hay datos disponibles</p>
          <p className="text-xs mt-1">Completa tu check-in diario para ver tu progreso</p>
        </div>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <YAxis domain={[0, 10]} className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="stress"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
