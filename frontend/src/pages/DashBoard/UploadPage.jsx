import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import UploadForm from "../../components/UploadForm";
import { FaBars } from "react-icons/fa";

const UploadPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="lg:ml-64 w-full p-4 sm:p-6 lg:p-10 min-h-screen bg-gray-100 ">
        <div className="lg:hidden flex items-center gap-3 mb-4">
          <button aria-label="Open Menu" onClick={() => setSidebarOpen(true)} className="p-2 border rounded">
            <FaBars />
          </button>
          <span className="font-semibold">Upload</span>
        </div>
        <UploadForm />
      </main>
    </div>
  );
};

export default UploadPage;
