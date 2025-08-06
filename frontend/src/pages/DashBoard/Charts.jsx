import { useState, useEffect } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import API from "../../api";
import Sidebar from "../../components/Sidebar";
import ThreeDChartWrapper from "./ThreeDChartWrapper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
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
        backgroundColor:
          chartType === "donut"
            ? ["#36CFC9", "#FFB84D", "#FF85C0", "#91D5FF", "#FFD666", "#B37FEB"]
            : chartType === "bar"
            ? "rgba(255, 99, 132, 0.6)"
            : "transparent",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        fill: false,
        stepped: chartType === "digital",
      },
    ],
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="ml-64 p-10 w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          📊 Chart Visualizations
        </h2>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            onChange={(e) => setXKey(e.target.value)}
            value={xKey}
            className="border p-2 rounded-lg bg-white shadow"
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
            className="border p-2 rounded-lg bg-white shadow"
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
            className="border p-2 rounded-lg bg-white shadow"
          >
            <optgroup label="2D Charts">
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="digital">Digital Signal</option>
              <option value="donut">Donut Chart</option>
            </optgroup>

            <optgroup label="3D Charts">
              <option value="3d">3D Chart</option>
            </optgroup>
          </select>
        </div>

        {/* Unified Chart Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          {xKey && yKey ? (
            chartType === "3d" ? (
              <ThreeDChartWrapper data={data} xKey={xKey} yKey={yKey} />
            ) : chartType === "donut" ? (
              <>
                <h3 className="text-lg font-bold mb-2">Dough</h3>
            
                <Doughnut data={chartData} />
              </>
            ) : chartType === "bar" ? (
              <Bar data={chartData} />
            ) : (
              <Line data={chartData} />
            )
          ) : (
            <p className="text-gray-600 text-lg">
              🔧 Please select both X and Y axes to display the chart.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;
