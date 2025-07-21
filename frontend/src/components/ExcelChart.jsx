import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExcelChart = ({ data }) => {
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");

  const keys = data.length > 0 ? Object.keys(data[0]) : [];

  const chartData = {
    labels: data.map(row => row[xKey]),
    datasets: [
      {
        label: `${yKey} vs ${xKey}`,
        data: data.map(row => row[yKey]),
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }
    ]
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">📈 Excel Data Chart</h2>

      <div className="flex gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">X-Axis</label>
          <select
            value={xKey}
            onChange={(e) => setXKey(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">Select</option>
            {keys.map((key, idx) => (
              <option key={idx} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Y-Axis</label>
          <select
            value={yKey}
            onChange={(e) => setYKey(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">Select</option>
            {keys.map((key, idx) => (
              <option key={idx} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
      </div>

      {xKey && yKey && <Bar data={chartData} />}
    </div>
  );
};

export default ExcelChart;
