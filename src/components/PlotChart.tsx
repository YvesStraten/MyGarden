import { LineChart, CartesianGrid, XAxis, Line } from "recharts";
import { Data } from "../bindings";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  value: {
    label: "Values",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function PlotChart(props: Data) {
  const points = props.graph.map((point) => ({
    time: point[0],
    value: point[1],
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart accessibilityLayer data={points}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line strokeWidth={2} dataKey="value" />
      </LineChart>
    </ChartContainer>
  );
}
