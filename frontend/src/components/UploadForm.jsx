import { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/upload", formData);
      alert("File uploaded successfully");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center w-full bg-fixed ">
      <h1 className="text-3xl font-bold mb-6">
        Upload <span className="text-blue-600">Excel Data</span> & Visualize
      </h1>
      <div className="w-full max-w-xl bg-white p-5 rounded shadow-md flex items-center gap-3">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="flex-grow border rounded px-4 py-2"
        />
        <button
          onClick={handleUpload}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadForm;
