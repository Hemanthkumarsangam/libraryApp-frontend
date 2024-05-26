import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { IoMdEye, IoMdEyeOff} from "react-icons/io";
import { SiGmail } from "react-icons/si";
import './signin.css'
import Loading  from '../loading/Loading';
import Navmenu from '../navmenu/Navmenu'
import BackBtn from '../backbtn/BackBtn'
import Popup from '../popup/Popup';

let isLoggedIn = false;
let user = null;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);  
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false)
  const [msg, setMsg] = useState('')
  
  useEffect(() => {
    if (!showPopup) return; 
    const timer = setTimeout(() => {
      setShowPopup(false); 
    }, 6000); 
    return () => clearTimeout(timer);
  }, [showPopup]);

  function popup(data){
    setLoading(false)
    setMsg(data)
    setShowPopup(true);
  }


  async function submit(e){
    setLoading(true)
    e.preventDefault();
    try {
      console.log(process.env.REACT_APP_BASE_URL)
        await axios.post(`${process.env.REACT_APP_BASE_URL}/user/login`, {
            email, password
        })
        .then(res =>{
            if(res.data.message === 'exist'){ 
              isLoggedIn = true
              user = res.data.user
              navigate('/')
            }
            else{
              popup(res.data.message)
            }
            setLoading(false)
        })
    } catch (error) {
        console.log(error)
        setLoading(false)
        popup('Unexpected server error\nTry again later')
    }
  }

  return (
    <>  
        <Navmenu/>
        <BackBtn/>
        <div id="login">
        {loading ? <Loading/> : <></>}
        <center>
        <form method='POST' onSubmit={submit} id='form'>
            <div className="inputBox">
                <i><SiGmail/></i>
                <input id='input' type="email" required placeholder="EMail" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
            </div>
            <div className="inputBox">
                <i onClick={() => {setShowPass(!showPass)}} style={{background: 'transparent', border: 'none', cursor:'pointer'}}>
                   { showPass ? <IoMdEyeOff /> : <IoMdEye />}
                </i>
                <input id='input' type={showPass ? 'text' : 'password'} required placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
            </div> 
            <center><button type="submit" className="logbtn" id='button'><b>Login</b></button></center><br /><br />
        <h3>Don't have an Account ?&nbsp;&nbsp;&nbsp;&nbsp;
            <Link to={'/signup'} style={{color: 'white', textDecoration : 'none'}}>Register</Link>
        </h3>
        </ form>
        </center>
        </div>
        { showPopup ? <Popup msg={msg} /> : <></>}
    </>
  )
}

export  {isLoggedIn, user, Login}