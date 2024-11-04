import logo from './logo.svg';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Register from './Components/LoginSignup/Register';
import Login from './Components/LoginSignup/Login';
import Layout from './Components/Layout';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* Public routes */}
        <Route path="login" element={<Login/>}></Route>
        <Route path="register" element={<Register/>}></Route>
        {/* <Route path="unauthorized" element={<Unauthorized/>}></Route> */}

        {/* Protected routes */}
        {/* <Route path="/" element={<Home/>}></Route>
        <Route path="AdminHome" element={<AdminHome/>}></Route> */}


        {/* Catch others */}
        {/* <Route path="*" element={<Missing/>}></Route> */}

      </Route>  
    </Routes>
  );
}

export default App;
