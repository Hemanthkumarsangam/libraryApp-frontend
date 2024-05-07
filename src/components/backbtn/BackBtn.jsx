import React from 'react'
import './BackBtn.css'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";

function BackBtn() {
  const navigate = useNavigate()
  return (
    <button onClick={() => {navigate(-1)}} id='backBtn'><FaArrowLeftLong />&nbsp;&nbsp;&nbsp;Back</button>
  )
}

export default BackBtn
