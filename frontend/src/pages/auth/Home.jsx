// import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import bg from "../../assets/bg.png"


const Home = () => {
  // const {  } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-linear-65 from-purple-500 to-green-500 flex items-center justify-center w-full">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center p-4 sm:p-6 md:p-8 bg-green-200">
        
        {/* Left Side: Image */}
    <div className="flex justify-center order-1 md:order-none">
          <img
          src={bg}
            alt="Excel Analytics "
      className="w-full max-w-md md:max-w-2xl h-auto rounded shadow-2xl object-cover"
          />
        </div>

        {/* Right Side: Welcome content */}
  <div className="bg-green-100 p-6 md:p-10 w-full rounded shadow-2xl text-center">
          <h1 className="text-4xl font-bold mb-5 text-green-800">Excel Analytics Platform</h1>

        </div>
      </div>
    </div>
  );
};

export default Home;
