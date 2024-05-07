import { useEffect, useState } from 'react'
import axios  from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import './signin.css'
import Loading  from '../loading/Loading';
import Navmenu from '../navmenu/Navmenu'
import BackBtn from '../backbtn/BackBtn';
import Popup from '../popup/Popup';

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
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
      await axios.post('https://libraryapp-backend.onrender.com/user/register', {
        name, email, password
      })
      .then(res => {
        popup(res.data.message)
        setLoading(false)
        if(res.data.message === 'Account created successfully'){
          setTimeout(() => {
            navigate("/login")
          }, 5050)
        }
      })
      .catch(e => {
        setLoading(false)
        popup('Unexpected server error\nTry again later')
        console.log(e)
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
    <Navmenu/>
    <BackBtn/>
    <div id="login" >
    {loading ? <Loading/> : <></>}
    <center>
    <form method='POST' onSubmit={submit} id='form'>
        <div className="inputBox">
            <i><FaUser /></i>
            <input id='input' type="text" required placeholder="First name" value={name} onChange={(e) => {setName(e.target.value)}}/>
        </div>  
        <div className="inputBox">
            <i><SiGmail /></i>
            <input id='input' type="email" required placeholder="EMail" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
        </div>
        <div className="inputBox">
            <i onClick={() => {setShowPass(!showPass)}} style={{background: 'transparent', border: 'none', cursor:'pointer'}}>
                { showPass ? <IoMdEyeOff /> : <IoMdEye />}
            </i>
            <input id='input' type={showPass ? 'text' : 'password'} required placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
        </div>
        <center><button type="submit" className="logbtn" id='button'>Sign up</button></center>  
        <h3>Already have an Account ?&nbsp;&nbsp;&nbsp;&nbsp; <Link to={'/login'} style={{color: 'white', textDecoration : 'none'}}>Login</Link></h3>    
    </ form>  
    </center></div>
    { showPopup ? <Popup msg={msg} /> : <></>}
    </>
  )
}

export default SignUp
