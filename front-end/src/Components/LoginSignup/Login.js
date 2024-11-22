import { useRef, useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import {Link, useNavigate, useLocation} from 'react-router-dom';


const LOGIN_URL = '/login';

const Login = () => {

    const { setAuth } = useAuth();
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


            
            console.log('Access Token:', accessToken);
            console.log('User role:', roles);

            // console.log('UserDTO:', response?.data?.userDTO);
            console.log('Is New User:', isNewUser);

            localStorage.setItem('token', accessToken);
            
            setAuth({ user, pwd, roles, accessToken, isNewUser});
            setUser('');
            setPwd('');

            if(isNewUser){
                navigate('/fill-out-profile', { replace: true });
            }else{
                navigate(from, {replace: true});
            }

        
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

  return (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                    <p>
                        Need an Account?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="#">Sign Up</a>
                        </span>
                    </p>
                </section>
  )
}

export default Login
