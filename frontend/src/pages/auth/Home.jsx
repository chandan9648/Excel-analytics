
import { AuthContext } from "../../context/AuthContext";
import bg from "../../assets/bg.png";


const Home = () => {
  // const {  } = useContext(AuthContext);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-purple-500 to-emerald-400 flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center rounded-2xl bg-white/70 backdrop-blur-md shadow-xl ring-1 ring-black/5 p-4 sm:p-6 md:p-10">

          {/* Left Side: Image */}
          <div className="flex justify-center order-1 md:order-none">
            <div className="w-full max-w-md md:max-w-2xl overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
              <img
                src={bg}
                alt="Excel Analytics"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Side: Welcome content */}
          <div className="w-full rounded-2xl bg-white/80 p-6 sm:p-8 md:p-10 shadow-lg ring-1 ring-black/5 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
              Excel Analytics Platform
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-700">
              Upload spreadsheets, transform data into interactive visualizations, and uncover key trends—faster and more efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
