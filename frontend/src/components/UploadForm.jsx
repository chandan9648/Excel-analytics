import { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store token in localStorage
        },
      });

      const parsedData = res.data.data;
      if (!parsedData || parsedData.length === 0) {
        alert("Upload succeeded but no data returned.");
      }

      setExcelData(parsedData || []);
    } catch (err) {
      console.error("Error Uploading", err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full bg-white p-5 min-h-screen">
      {/* Dynamic Heading */}
      <h1 className="text-3xl font-bold mb-6">
        {excelData.length > 0 ? (
          <>
            Uploaded <span className="text-blue-600">Data</span>
          </>
        ) : (
          <>
            Upload <span className="text-blue-600">Excel</span> File
          </>
        )}
      </h1>

      {/* Upload section — only visible when no data is displayed */}
      {excelData.length === 0 && (
        <>
          <div className="w-full max-w-xl bg-green-200 p-5 rounded shadow-md flex items-center gap-3">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setFile(e.target.files[0])}
              className="flex-grow border rounded px-4 py-2"
            />
            <button
              onClick={handleUpload}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {!uploading && (
            <p className="mt-4 text-gray-500">No Excel data to display yet.</p>
          )}
        </>
      )}

      {/* Display Excel Table */}
      {excelData.length > 0 && (
        <div className="overflow-x-auto mt-6 w-full max-w-6xl">
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr>
                {Object.keys(excelData[0]).map((col) => (
                  <th key={col} className="border border-gray-300 px-3 py-1 bg-gray-200">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((cell, i) => (
                    <td key={i} className="border border-gray-300 px-3 py-1">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
