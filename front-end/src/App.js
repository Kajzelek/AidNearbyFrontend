import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup.css';
import Register from './Components/LoginSignup/Register';
import Register2 from './Components/LoginSignup/Register2';
import Login from './Components/LoginSignup/Login';
import Login2 from './Components/LoginSignup/Login2';
import Layout from './Components/Layout';
import RequireAuth from './Components/Auth/RequireAuth';
import FillOutProfile from './Components/Profile/FillOutProfile';
import FillOutProfile2 from './Components/Profile/FillOutProfile2';
import HomePage from './Components/Home/HomePage';
import HomePage2 from './Components/Home/HomePage2';
import Navbar from './Components/Home/Navbar';
import { Routes, Route } from 'react-router-dom';
import MainSection from './Components/Home/MainSection';
import Footer from './Components/Home/Footer';
import AboutSection from './Components/Home/AboutSection';
import FeaturedAds from './Components/Home/FeaturedAds';
import CreateAdForm from './Components/Home/CreateAdForm';

const ROLES = {
  'User'  : 'USER',
  'Admin' : 'ADMIN' 
};


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
        {/* Public routes */}
        <Route path="login" element={<Login />} />
        <Route path="login2" element={<Login2 />} />
        <Route path="register" element={<Register />} />
        <Route path="register2" element={<Register2 />} />
        
        {/* Protected routes */}
        {/* User routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/hp2" element={<HomePage2 />} />
          <Route path="/hp3" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow bg-gray-100">
                <MainSection />
              </main>
              <Footer />
            </div>
          } />

          <Route path="/create-ad" element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                  <main className="flex-grow bg-gray-100">
                    <CreateAdForm />
                  </main>
                <Footer />
              </div>
          } />


          <Route path="/fill-out-profile" element={<FillOutProfile />} />
          <Route path="/fill-out-profile2" element={<FillOutProfile2 />} />
        </Route>
        
        {/* Admin routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          {/* Admin-specific routes */}
          {/* <Route path="AdminHome" element={<AdminHome />} /> */}
        </Route>
        
        {/* Catch others */}
        {/* <Route path="*" element={<Missing />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
