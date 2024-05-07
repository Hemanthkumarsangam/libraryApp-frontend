import axios from 'axios'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './update.css'
import Navmenu from '../navmenu/Navmenu'
import BackBtn from '../backbtn/BackBtn'
import Loading  from '../loading/Loading'

function UpdateName() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state.email
  const [password, setPassword ] = useState('')
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(false)

  async function updateName(e){
    setLoading(true)
    e.preventDefault();
    try {
      await axios.post('https://libraryapp-backend.onrender.com/user/login', {
        email, password
      })
      .then(async (res) =>{
        if(res.data.message === 'exist'){ 
          await axios.put('https://libraryapp-backend.onrender.com/user/updateName', {
            email, password, newName
        })
        .then((res) => {
          setLoading(false)
          alert(res.data.message)
          navigate(-1)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
          alert('Unexpected server error\nCannot update details\nTry again later')
        })
        }else{
          alert(res.data.message)
        }
        setLoading(false)
      })
    } catch (error) {
        console.log(error)
        setLoading(false)
        alert('Unexpected server error\nTry again later')
    }
  }

  return (
    <div className='update'>
      <Navmenu/>
      <BackBtn/>
      <center>
      <form onSubmit={updateName}>
        <input type="password" required value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder='Password'/>
        <input type="text" required value={newName} onChange={(e) => {setNewName(e.target.value)}} placeholder='New Name'/>
        <button>submit</button>
        {loading ? <div id='logLoad'><Loading/></div> : <></>}
      </form>
      </center>
    </div>
  )
}

export default UpdateName
