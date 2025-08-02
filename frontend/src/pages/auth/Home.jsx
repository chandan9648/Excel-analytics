// import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import bg from "../../assets/bg.png"


const Home = () => {
  // const {  } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center ">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 bg-green-200">
        
        {/* Left Side: Image */}
        <div className="flex justify-center">
          <img
          src={bg}
            alt="Excel Analytics "
            className="w-full max-w-md md:max-w-170 h-100 rounded ml-20 shadow- 2xl object-cover"
          />
        </div>

        {/* Right Side: Welcome content */}
        <div className="bg-green-100 p-18 w-100 ml-20 rounded shadow-2xl text-center">
          <h1 className="text-4xl font-bold mb-5 text-green-800">Excel Analytics Platform</h1>

        </div>
      </div>
    </div>
  );
};

export default Home;
