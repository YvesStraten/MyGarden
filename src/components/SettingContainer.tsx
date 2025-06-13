import { Setting } from "@/bindings";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { getSymbol } from "@/functions/utils";

export default function SettingContainer(props: Setting) {
  const { name, value } = props;
  return (
    <Card className="p-5">
      <CardTitle className="font-center">{name}</CardTitle>
      <CardDescription>{value + ": " + getSymbol(name, 1)}</CardDescription>
    </Card>
  );
}
