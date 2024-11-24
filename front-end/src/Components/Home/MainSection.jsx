import { AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai';
import { FaUserFriends, FaBullhorn } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MainSection = () => {

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="container mx-auto px-6 md:px-12 lg:px-20">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pb-16">
      {/* Left side - Description and Buttons */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Welcome to Aid Nearby
        </h2>
        <p className="text-gray-600 mb-8">
          Aid Nearby to aplikacja wspierająca pomoc sąsiedzką. Znajdź pomoc lub zaoferuj swoje wsparcie już dziś!
        </p>
        <div className="space-y-4">

          <button 
            onClick={() => navigate('/create-ad')}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition duration-300"
          >
            
            <AiOutlinePlus size={20} />
            <span>Add Advertisement</span>
          </button>

          <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 transition duration-300">
            <AiOutlineSearch size={20} />
            <span>Search Advertisement</span>
          </button>
        </div>
      </div>

      {/* Right side - Stats and Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <FaUserFriends size={36} className="text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Active Users</h3>
          <p className="text-gray-500 text-xl">1,250+</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <FaBullhorn size={36} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Advertisements</h3>
          <p className="text-gray-500 text-xl">300+</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <AiOutlinePlus size={36} className="text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Post Ads Easily</h3>
          <p className="text-gray-500">Zaproponuj swoją pomoc szybko i bez wysiłku!</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <AiOutlineSearch size={36} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Find Help Nearby</h3>
          <p className="text-gray-500">Znajdź potrzebne wsparcie w Twojej okolicy.</p>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default MainSection;
