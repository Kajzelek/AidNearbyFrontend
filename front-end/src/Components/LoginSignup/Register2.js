import { useRef, useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import DesignerLogo from '../Assets/Designer.png';


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const REGISTER_URL = '/register';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [user, email, pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValidUser = USER_REGEX.test(user);
        const isValidPwd = PWD_REGEX.test(pwd);
        if (!isValidUser || !isValidPwd) {
            setErrMsg('Invalid input');
            return;
        }

        try {
            const response = await axios.post(
                `${REGISTER_URL}?username=${user}&email=${email}&password=${pwd}`,
                null,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            console.log('Registration Success:', response?.data);

            setSuccess(true);
            setUser('');
            setEmail('');
            setPwd('');
            setMatchPwd('');

            navigate('/login', { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username or Email already exists');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        <section className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
                <p
                    ref={errRef}
                    className={errMsg ? 'errmsg' : 'offscreen'}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>

                <div className="md:w-1/2 px-8 md:px-16">
                    <h2 className="font-bold text-2xl text-[#002D74]">Register</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            className="p-2 mt-8 rounded-xl border"
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                            placeholder="Username"
                            required
                        />
                        {userFocus && user && !validName && (
                            <p className="text-red-500 text-xs">
                                Username must be 4-24 characters and start with a letter.
                            </p>
                        )}

                        <input
                            className="p-2 rounded-xl border"
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                            placeholder="Email"
                            required
                        />
                        {emailFocus && email && !validEmail && (
                            <p className="text-red-500 text-xs">Invalid email address.</p>
                        )}

                        <input
                            className="p-2 rounded-xl border"
                            type="password"
                            id="password"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            placeholder="Password"
                            required
                        />
                        {pwdFocus && pwd && !validPwd && (
                            <p className="text-red-500 text-xs">
                                Password must be 8-24 characters with uppercase, lowercase,
                                number, and special character.
                            </p>
                        )}

                        <input
                            className="p-2 rounded-xl border"
                            type="password"
                            id="confirm_password"
                            value={matchPwd}
                            onChange={(e) => setMatchPwd(e.target.value)}
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            placeholder="Confirm Password"
                            required
                        />
                        {matchFocus && matchPwd && !validMatch && (
                            <p className="text-red-500 text-xs">Passwords do not match.</p>
                        )}

                        <button
                            className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300"
                            disabled={!validName || !validEmail || !validPwd || !validMatch}
                        >
                            Register
                        </button>
                    </form>
                </div>
                {/* <div className="md:block hidden w-1/2">
                    <img
                        className="rounded-2xl"
                        src="https://images.unsplash.com/photo-1616606103915-dea7be788566?ixlib=rb-1.2.1&auto=format&fit=crop&w=1887&q=80"
                        alt="Decoration"
                    />
                </div> */}

                <div className="md:block hidden w-1/2">
                    <img className="rounded-2xl" src={DesignerLogo} alt="Designer Logo" />
                </div>
            </div>
        </section>
    );
};

export default Register;
