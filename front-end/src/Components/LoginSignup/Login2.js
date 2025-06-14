import { useRef, useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import { useLocationContext } from '../../context/LocationContext';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DesignerLogo from '../Assets/Designer.png';


const LOGIN_URL = '/login';

const Login = () => {

    const { setAuth } = useAuth();
    const { setLocation } = useLocationContext();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location?.state?.from || { pathname: '/' };
    const userRef = useRef();
    const errRef = useRef();
    
    

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${LOGIN_URL}?username=${user}&password=${pwd}`,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            
            console.log(JSON.stringify(response?.data));

            const accessToken = response?.data?.token;
            const roles = response?.data?.userDTO?.role; //Zastanowić się czy nie lepiej odbierać dane o roli przez token
            const isNewUser = response?.data?.userDTO?.isNewUser;
            const latitude = response?.data?.userDTO?.latitude;
            const longitude = response?.data?.userDTO?.longitude;


            console.log('Access Token:', accessToken);
            console.log('User role:', roles);
            console.log('Is New User:', isNewUser);
            console.log('latitude:', latitude);
            console.log('longitude:', longitude);
        


            // console.log('UserDTO:', response?.data?.userDTO);
            

            localStorage.setItem('token', accessToken);


            setLocation({ latitude, longitude });
            setAuth({ user, pwd, roles, accessToken, isNewUser});
            setUser('');
            setPwd('');

            if(isNewUser){
                navigate('/fill-out-profile2', { replace: true });
            }else{
                navigate(from, {replace: true});
            }

        
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                toast.error('Missing Username or Password', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                //setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    

return (
    
//TODO: Naprawić powiadomienia z serwera żeby się jakoś ładnie wyświetlały i w konretnym miejscu
    

    <section class="bg-gray-50 min-h-screen flex items-center justify-center">

        
        <div class="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> 
        

            <div class="md:w-1/2 px-8 md:px-16">
                <h2 class="font-bold text-2xl text-[#002D74]">Login</h2>
                <p class="text-xs mt-4 text-[#002D74]">If you are already a member, easily log in</p>

                <form onSubmit={handleSubmit} action="" class="flex flex-col gap-4">

                    <input 
                        class="p-2 mt-8 rounded-xl border"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                        type="text" //type="email" tu było
                        name="username"
                        placeholder="Username"
                    />
                    
                    <div class="relative">
                        <input 
                        class="p-2 rounded-xl border w-full"
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        name="password"
                        placeholder="Password"/>
    
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" class="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                        </svg>

                    </div>

                    <button class="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300">Login</button>

                </form>

                <div class="mt-6 grid grid-cols-3 items-center text-gray-400">
                    <hr class="border-gray-400"/>
                    
                    <hr class="border-gray-400"/>
                </div>

                <div class="mt-3 text-xs flex justify-between items-center text-[#002D74]">
                    <p>Don't have an account?</p>
                    <button 
                        class="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
                        onClick={() => navigate('/register2')}
                    >
                    Register
                    </button>
                </div>

            </div>

            {/* <div class="md:block hidden w-1/2">
                <img class="rounded-2xl" src="https://images.unsplash.com/photo-1616606103915-dea7be788566?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"/>
            </div> */}

<div className="md:block hidden w-1/2">
    <img className="rounded-2xl" src={DesignerLogo} alt="Designer Logo" />
</div>

        </div>
    </section>

                
)
}

export default Login
