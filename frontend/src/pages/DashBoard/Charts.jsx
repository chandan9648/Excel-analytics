  // Helper: Calculate bins for Y-axis data, always up to 100
  const getBins = (dataArr, yKey, binSize = 5) => {
    if (!yKey || dataArr.length === 0) return [];
    const values = dataArr.map((item) => Number(item[yKey])).filter((v) => !isNaN(v));
    if (values.length === 0) return [];
    const min = 0;
    const max = Math.max(...values);
    const bins = [];
    let start = min;
    while (start <= max) {
      const end = start + binSize;
      const count = values.filter((v) => v >= start && v < end).length;
      bins.push({ range: `${start} - ${end}`, count });
      start = end;
    }
    return bins;
  };
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
         
              <option value="scatter">Scatter Chart</option>
              <option value="donut">Donut Chart</option>
            </optgroup>

            <optgroup label="3D Charts">
              <option value="3d">3D Line Chart</option>
             
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
                <h3 className="text-lg font-bold mb-2">Donut </h3>
            
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

        {/* Data Range Analysis - Custom Horizontal Bar UI below the chart card */}
        {yKey && data.length > 0 && (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-full bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                Data Range Analysis <span className="text-blue-500 text-base">(%)</span>
              </h4>
              <div className="space-y-4 w-full">
                {(() => {
                  const bins = getBins(data, yKey);
                  const total = bins.reduce((sum, b) => sum + b.count, 0) || 1;
                  return bins.map((bin, idx) => {
                    const percent = ((bin.count / total) * 100).toFixed(1);
                    return (
                      <div key={idx} className="flex items-center w-full">
                        <div className="w-24 text-sm text-gray-700 font-semibold">{bin.range}</div>
                        <div className="flex-1 mx-2 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                          <div
                            className="bg-blue-500 h-6 rounded-full flex items-center pl-3 text-white font-bold text-sm transition-all duration-300"
                            style={{ width: `${percent}%`, minWidth: bin.count > 0 ? '2.5rem' : 0 }}
                          >
                            {bin.count > 0 && <span>{bin.count}</span>}
                          </div>
                        </div>
                        <div className="w-16 text-right text-blue-700 font-semibold">{percent}%</div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default Charts;
