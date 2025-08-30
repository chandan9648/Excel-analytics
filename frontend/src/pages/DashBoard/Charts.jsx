import { useState, useEffect, useRef } from "react";
import { Bar, Line, Doughnut, Scatter } from "react-chartjs-2";
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
import { FaBars } from "react-icons/fa";
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

// Data Range Analysis removed

const Charts = () => {
  const chartRef = useRef(null);
  const threeCanvasRef = useRef(null);
  const [uploads, setUploads] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [data, setData] = useState([]);
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Data Range Analysis removed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/upload/history");
        const files = res.data || [];
        setUploads(files);
  // Don't auto-select any file; wait for user selection
  setSelectedFileId("");
  setData([]);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // When file selection changes, update the data used for charts
  useEffect(() => {
    if (!selectedFileId) {
      setData([]);
      setXKey("");
      setYKey("");
      return;
    }
    const file = uploads.find((f) => f._id === selectedFileId);
    setData(file?.parsedData || []);
    setXKey("");
    setYKey("");
  }, [selectedFileId, uploads]);

  const keys = data.length > 0 ? Object.keys(data[0]) : [];

  // Build labels/values (sorted for Bar to resemble screenshot)
  const pairs = (xKey && yKey
    ? data.map((d) => ({ x: d[xKey], y: Number(d[yKey]) }))
    : []
  ).filter((p) => p.x !== undefined && !Number.isNaN(p.y));

  const sortedPairs = chartType === "bar"
    ? [...pairs].sort((a, b) => b.y - a.y)
    : pairs;

  const labels = sortedPairs.map((p) => String(p.x));
  const values = sortedPairs.map((p) => p.y);

  // Nice gradient color list for bars
  const barColors = values.map((_, i) => `hsl(${220 + (i / Math.max(1, values.length)) * 80} 70% 60%)`);

  const chartData = {
    labels,
    datasets: [
      {
        label: xKey && yKey ? `${yKey} vs ${xKey}` : "",
        data: values,
        backgroundColor:
          chartType === "donut"
            ? ["#36CFC9", "#FFB84D", "#FF85C0", "#91D5FF", "#FFD666", "#B37FEB"]
            : chartType === "bar"
            ? barColors
            : "transparent",
        borderColor: chartType === "bar" ? barColors : "rgba(54, 162, 235, 1)",
        borderWidth: chartType === "bar" ? 1 : 2,
        fill: false,
        stepped: chartType === "digital",
      },
    ],
  };

  // Scatter data: requires numeric x and y
  const scatterData = {
    datasets: [
      {
        label: xKey && yKey ? `${yKey} vs ${xKey}` : "",
        data: (xKey && yKey
          ? data
              .map((d) => ({ x: Number(d[xKey]), y: Number(d[yKey]) }))
              .filter((p) => !Number.isNaN(p.x) && !Number.isNaN(p.y))
          : []),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const commonOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: {
      x: { title: { display: true, text: xKey || "X" } },
      y: { title: { display: true, text: yKey || "Y" } },
    },
  };

  const handleDownload = () => {
    try {
      let url = "";
      if (chartType === "3d") {
        const canvas = threeCanvasRef.current;
        if (!canvas) return;
        url = canvas.toDataURL("image/png");
      } else {
        const chart = chartRef.current;
        if (!chart) return;
        url = chart.toBase64Image();
      }
      const a = document.createElement("a");
      const file = uploads.find((f) => f._id === selectedFileId);
      const base = (file?.filename || "chart").replace(/\.[^/.]+$/, "");
      a.href = url;
      a.download = `${base}-${chartType}-${xKey}-vs-${yKey}.png`;
      a.click();
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 p-4 sm:p-6 lg:p-10 w-full">
        <div className="lg:hidden flex items-center gap-3 mb-4">
          <button aria-label="Open Menu" onClick={() => setSidebarOpen(true)} className="p-2 border rounded">
            <FaBars />
          </button>
          <span className="font-semibold">Charts</span>
        </div>
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Chart Visualization</h2>

        {/* Controls */}
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">Select File:</label>
            <select
              onChange={(e) => setSelectedFileId(e.target.value)}
              value={selectedFileId}
              className="border p-2 rounded-lg bg-white shadow min-w-64"
            >
              <option value="">Select File</option>
              {uploads.map((u) => (
                <option key={u._id} value={u._id}>{u.filename}</option>
              ))}
            </select>
          </div>
          <select
            onChange={(e) => setXKey(e.target.value)}
            value={xKey}
            disabled={!selectedFileId}
            className={`border p-2 rounded-lg bg-white shadow ${!selectedFileId ? "opacity-60 cursor-not-allowed" : ""}`}
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
            disabled={!selectedFileId}
            className={`border p-2 rounded-lg bg-white shadow ${!selectedFileId ? "opacity-60 cursor-not-allowed" : ""}`}
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
              {/* <option value="scatter">Scatter Chart</option> */}
              <option value="donut">Donut Chart</option>
            </optgroup>

            <optgroup label="3D Charts">
              <option value="3d">3D Line Chart</option>
            </optgroup>
          </select>

          <button
            onClick={handleDownload}
            disabled={!selectedFileId || !xKey || !yKey}
            className="ml-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-4 py-2 cursor-pointer rounded shadow"
          >
            ⬇️ Download Chart
          </button>
        </div>

        {/* Unified Chart Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      {selectedFileId && xKey && yKey ? (
            chartType === "3d" ? (
              <ThreeDChartWrapper
                data={data}
                xKey={xKey}
                yKey={yKey}
                onCanvasReady={(el) => (threeCanvasRef.current = el)}
              />
            ) : chartType === "donut" ? (
              <>
                <h3 className="text-lg font-bold mb-2">Donut</h3>
                <Doughnut ref={chartRef} data={chartData} />
              </>
            ) : chartType === "bar" ? (
              <Bar ref={chartRef} data={chartData} options={commonOptions} height={420} />
            ) : chartType === "scatter" ? (
              <Scatter ref={chartRef} data={scatterData} options={{ ...commonOptions, parsing: false }} height={420} />
            ) : (
              <Line ref={chartRef} data={chartData} options={commonOptions} height={420} />
            )
          ) : (
            <p className="text-gray-600 text-lg">
        🔧 Please select a file and choose both X and Y axes to display the chart.
            </p>
          )}
        </div>

 
      </div>
    </div>
  );
};

export default Charts;
