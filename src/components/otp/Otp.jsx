import React, { useState, useRef, useEffect } from 'react';
import './otp.css'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Popup from '../popup/Popup';
import Loading from '../loading/Loading';

function Otp() {
    const navigate = useNavigate()
    const location = useLocation()
    const {email, password, name} = location.state
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const previousKey = useRef('');
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
  

    const handleChange = (index, event) => {
        const { value } = event.target;
        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);
        if (value.length === 1 && index < digits.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace') {
            if (previousKey.current === 'Backspace' && index > 0) {
                inputRefs.current[index - 1].focus();
            }
            previousKey.current = 'Backspace';
        } else {
            previousKey.current = event.key;
        }
    };

    const handleSubmit =async (event) => {
        setLoading(true)
        event.preventDefault();
        const rotp = digits.join('');
        console.log(name, email, password)
        await axios.post(`${process.env.REACT_APP_BASE_URL}/user/otpVerify`, {rotp, email, password, name})
        .then((res) => {
          setLoading(false)
          popup(res.data.message)
          if(res.data.message === 'Account created successfully'){
            setTimeout(() => {
                navigate('/login')
            }, 5050)
          }
        })
        .catch(e=>{
          setLoading(false)
          popup('Unexpected server error\nTry again later')
          console.log(e)
        })
    };

    return ( 
        <div className="otp">
        {loading ? <Loading/> : <></>}
        {showPopup ? <Popup msg={msg} /> : <></>}
            <center>
                <form onSubmit={handleSubmit}>
                <h1>Enter the OTP sent to the email</h1>
                <div className="inpHolder">
                    {digits.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            id={`digit${index + 1}`}
                            value={digit}
                            onChange={(event) => handleChange(index, event)}
                            onKeyDown={(event) => handleKeyDown(index, event)}
                            maxLength={1}
                            ref={(input) => (inputRefs.current[index] = input)}
                            required
                        />
                    ))}
                </div>
                <button type="submit">Submit</button>
                </form>
                <br /><br /><br /><br /><p>kindly check the spam if mail not found</p>
            </center>
        </div>
    );
}

export default Otp;