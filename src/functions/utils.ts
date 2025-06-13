export function getSymbol(name: string, index: number = 1) {
  const possibleSettings: { [index: string]: string } = {
    humidity: "%",
    lux: "lx",
    temperature: "°C",
    temp: "°C",
    light: "lx",
  };

  const cleanName = name.split(" ")[index].toLowerCase();

  return possibleSettings[cleanName];
}
