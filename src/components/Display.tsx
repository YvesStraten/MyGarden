import { ArcElement, Chart, Legend, Tooltip } from "chart.js/auto";
import { display } from "../types/types";
import { Line } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

const Display = ({ char, tahan }: display) => {
  return (
    <div className="tahan_container flex flex-col items-center border p-1 m-3">
      <h1 className="font-bold">{tahan.name}</h1>
      <h1>
        {tahan.value} {char}
      </h1>
      <h2>Past values:</h2>
      <Line
        data={{
          labels: tahan.graph.labels,
          datasets: [
            {
              label: tahan.graph.dataset.label,
              data: tahan.graph.dataset.points,
            },
          ],
        }}
      />
    </div>
  );
};

export default Display;
