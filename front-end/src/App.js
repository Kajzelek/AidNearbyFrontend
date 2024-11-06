import logo from './logo.svg';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Register from './Components/LoginSignup/Register';
import Login from './Components/LoginSignup/Login';
import Layout from './Components/Layout';
import RequireAuth from './Components/Auth/RequireAuth';
import FillOutProfile from './Components/Profile/FillOutProfile';
import HomePage from './Components/Home/HomePage';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* Public routes */}
        <Route path="login" element={<Login/>}></Route>
        <Route path="register" element={<Register/>}></Route>
        

        {/* Protected routes  */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="fill-out-profile" element={<FillOutProfile/>}></Route>
          {/* </Route><Route path="AdminHome" element={<AdminHome/>}></Route> */}
        </Route>


        {/* Catch others  */}
        {/* <Route path="*" element={<Missing/>}></Route> */}

      </Route>  
    </Routes>
  );
}

export default App;
