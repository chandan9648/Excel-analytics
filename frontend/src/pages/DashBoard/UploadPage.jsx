import Sidebar from "../../components/Sidebar";
import UploadForm from "../../components/UploadForm";

const UploadPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full p-10 min-h-screen bg-gray-50 fixed">
        <UploadForm />
      </main>
    </div>
  );
};

export default UploadPage;
