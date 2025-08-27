import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, FileText, Trash2, Eye } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UploadForm = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      const parsedData = res.data.data;
      setExcelData(parsedData || []);
      setShowTable(false);

  toast.success("File uploaded successfully!", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "light",
      });

  // Redirect to Chart Visualization page after success
  navigate("/dashboard/charts");

    } catch (err) {
      console.error("Error uploading:", err);
      const msg = err.response?.status === 409
        ? "File already exists"
        : (err.response?.data?.message || "Upload failed");
      toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    setFile(null);
    setExcelData([]);
    setShowTable(false);
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-start justify-start p-8 relative">
      <ToastContainer />

      <div className="w-full bg-white rounded-lg shadow-md p-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4 text-green-700">Upload Excel Files</h2>
        <p className="text-center text-gray-600 mb-8">
          Easily upload and manage your Excel files. Drag and drop files, or click the button below to browse.
        </p>

        {/* Upload UI */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="border-2 border-dashed border-green-400 p-6 rounded-md w-full md:w-1/2 flex flex-col items-center justify-center">
            <Upload className="w-10 h-10 text-green-600 mb-2" />
            <p className="mb-2 text-sm text-gray-500">Drag and Drop your files here</p>
            <label htmlFor="fileInput" className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded inline-flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Browse Files
            </label>
            <input
              id="fileInput"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* File preview */}
          {file && (
            <div className="flex items-center bg-green-100 border border-green-300 px-4 py-2 rounded w-full md:w-1/2 justify-between">
              <span className="text-green-800 font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {file.name}
              </span>

              <div className="flex items-center gap-3">
                {excelData.length > 0 && (
                  <button
                    onClick={() => setShowTable(!showTable)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                )}
                <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload button */}
        {file && (
          <div className="text-center mt-6">
            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-green-700 transition cursor-pointer"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </button>
          </div>
        )}

        {/* Table preview */}
        {showTable && excelData.length > 0 && (
          <div className="mt-10 overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4 text-green-800">Uploaded Data Preview</h3>
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {Object.keys(excelData[0]).map((col) => (
                    <th key={col} className="border border-gray-300 px-3 py-2 text-left">
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
    </div>
  );
};

export default UploadForm;
