import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  const [data, setData] = useState([]);
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/upload/history");
        const allData = res.data.flatMap((file) => file.parsedData);
        setData(allData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const keys = data.length > 0 ? Object.keys(data[0]) : [];

  const chartData = {
    labels: data.map((item) => item[xKey]),
    datasets: [
      {
        label: `${yKey} vs ${xKey}`,
        data: data.map((item) => item[yKey]),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 p-10 bg-green-50 min-h-screen w-full">
        <h2 className="text-3xl font-bold mb-6 text-green-800">📈 Data Chart</h2>

        {/* Axis Selectors */}
        <div className="flex gap-4 mb-6">
          <select
            onChange={(e) => setXKey(e.target.value)}
            value={xKey}
            className="border p-2 rounded"
          >
            <option value="">Select X-axis</option>
            {keys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setYKey(e.target.value)}
            value={yKey}
            className="border p-2 rounded"
          >
            <option value="">Select Y-axis</option>
            {keys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setChartType(e.target.value)}
            value={chartType}
            className="border p-2 rounded"
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
          </select>
        </div>

        {/* Chart Display */}
        {xKey && yKey ? (
          chartType === "bar" ? (
            <Bar data={chartData} />
          ) : (
            <Line data={chartData} />
          )
        ) : (
          <p className="text-gray-600">
            Please select both X and Y axes to display the chart.
          </p>
        )}
      </div>
    </div>
  );
};

export default Charts;
