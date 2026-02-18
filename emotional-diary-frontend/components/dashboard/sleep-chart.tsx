"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  CartesianGrid,
  Cell,
} from "recharts"

interface SleepStressChartProps {
  data: Array<{
    date: string
    sleepHours: number
    stressLevel: number
  }>
}

const getSleepColor = (hours: number) => {
  if (hours >= 8) return "hsla(142, 71%, 45%, 0.8)" // Green
  if (hours >= 6) return "hsla(48, 96%, 50%, 0.8)" // Yellow
  return "hsla(0, 72%, 51%, 0.8)" // Red
}

export function SleepChart({ data }: SleepStressChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Correlación Sueño vs. Estrés</CardTitle>
        <CardDescription>Comparativa de horas de sueño y nivel de estrés.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
            />
            <YAxis
              yAxisId="left"
              label={{ value: "Horas de Sueño", angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, dx: -10 }}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 12]}
              tickFormatter={(value) => `${value}h`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "Nivel de Estrés", angle: 90, position: 'insideRight', style: { textAnchor: 'middle' }, dx: 10 }}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 10]}
            />
            <Tooltip
              wrapperStyle={{ zIndex: 1000 }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
              }}
              labelFormatter={(label) => new Date(label).toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long' })}
            />
            <Legend verticalAlign="top" align="right" />
            <Bar dataKey="sleepHours" name="Horas de Sueño" yAxisId="left" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getSleepColor(entry.sleepHours)} />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="stressLevel"
              name="Nivel de Estrés"
              yAxisId="right"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
