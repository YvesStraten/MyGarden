import { Data } from "@/bindings";
import { PlotChart } from "./PlotChart";
import { getSymbol } from "@/functions/utils";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";

export default function Display(props: Data) {
  const { name, value } = props;
  return (
    <Card className="w-full p-4">
      <CardTitle>{name}</CardTitle>
      <CardDescription>
        {value} {getSymbol(name, 0)}
      </CardDescription>
      <CardContent>
        <PlotChart {...props} />
      </CardContent>
    </Card>
  );
}
