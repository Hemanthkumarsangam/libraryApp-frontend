import React, { useState } from 'react'
import Navmenu from '../navmenu/Navmenu'
import BackBtn from '../backbtn/BackBtn'
import './lend.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn, user } from '../login/Login'
import Loading  from '../loading/Loading' 
import Popup from '../popup/Popup'

function Lend() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [bookCount, setBookCount] = useState('')
  const [loading, setLoading] = useState(false)
  const email = isLoggedIn ? user.email : undefined;
  const [showPopup, setShowPopup] = useState(false)
  const [msg, setMsg] = useState('')

  function popup(data){
    setMsg(data)
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false)
    }, 6000)
    setTimeout(() => {
      navigate(-1)
    }, 6000)
  }

  async function handleSubmit(e){
    e.preventDefault()
    setName(name.trim())
    setAuthor(author.trim())
    setLoading(true)
    try {
      if(isLoggedIn){
      await axios.put(`${process.env.REACT_APP_BASE_URL}/user/lend`, {
        name, author, bookCount, email
      })      
      .then(async (res1) => {
        setLoading(false)
        popup(res1.data.message)
      })}else{
        if(window.confirm('Login to perform this action')){navigate('/login'); return}
        else {setLoading(false); return}
      }
    } catch (error) {
      setLoading(false)
      popup('Unexpected server error\nTry again later')
      console.log(error)
    }
  }
  
  return (
    <div className='lend'>
      <Navmenu/>
      <BackBtn/>
      <center>
      <form onSubmit={handleSubmit}>
          <input type="text" value={name} required onChange={(e) => {setName(e.target.value)}} placeholder='Name of the book' />
          <input type="text" value={author} required onChange={(e) => {setAuthor(e.target.value)}} placeholder='Name of the Author' />
          <input type="number" value={bookCount} required onChange={(e) => {setBookCount(parseInt(e.target.value))}} placeholder='Number of books' />
          <center><button>Submit</button></center>
          {
            loading ? <div id='load'><Loading/></div> : <></>
          }
      </form>
      </center>
      { showPopup ? <Popup msg={msg} /> : <></>}
    </div>
)
}

export default Lend
