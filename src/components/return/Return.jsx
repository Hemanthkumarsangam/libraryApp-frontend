import React, { useEffect, useState } from 'react'
import Navmenu from '../navmenu/Navmenu'
import BackBtn from '../backbtn/BackBtn'
import { isLoggedIn, user } from '../login/Login'
import { Link, useNavigate } from 'react-router-dom'
import './return.css'
import axios from 'axios'
import Loading  from '../loading/Loading'
import Popup from '../popup/Popup'

function Return() {
  const navigate = useNavigate()
  const email = isLoggedIn ? user.email : null
  const [borrowed, setBorrowed] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const [msg, setMsg] = useState('')

  function popup(data){
    setMsg(data)
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false)
    }, 6000)
  }

  useEffect(() => {
    async function fetchData(){
      if(isLoggedIn){
        await axios.get(`https://libraryapp-backend.onrender.com/user/profile/${email}`)
        .then((res) => {
          setLoading(false)
          setBorrowed(res.data.borrowed.filter((book) => book.returned === false))
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
          popup('Unexpected server error\nTry again later')
        })
    }}
    fetchData()
  }, [email])

  async function handleReturn(book){
    if(window.confirm(`Are you sure you want to return ${book.name}`)){
        const name = book.name
        const author = book.author
        const date = book.date
        const email = user.email
        try {
        await axios.put('https://libraryapp-backend.onrender.com/book/return', {
            name, author
        })
        .then(async () => {
            await axios.put('https://libraryapp-backend.onrender.com/user/return', {
                date, email
            })
            .then((res2) => {
            if(parseInt(res2.data.message) < 0){
                popup(`You are fined whith ${res2.data.message} points due to late return of the book`)
            }else{
                popup(`You are rewarded whith ${res2.data.message} points`)
            }
            setTimeout(() => {
              navigate(-1)
            }, 6000)
            })
        })  
        } catch (error) {
        console.log(error)
    }}else{
        return
    }
  }

  return (
    <div className='return'>
      <Navmenu/>
      <BackBtn/>
      {
        isLoggedIn 
        ? loading ? <div id="retLoad"><Loading/></div>
         : (borrowed.length !== 0)
           ?<div className="bookHolder">
           {borrowed.map((book, index) => 
             <table key={index} style={{width: '17rem'}}>
               <tbody>
                 <tr><td><b><p id='bookName'>{book.name}</p></b></td></tr>
                 <tr><td><p id='bookAuthor'>{book.author}</p></td></tr>
                 <center><button onClick={() => {handleReturn(book)}}>Return</button></center>
               </tbody>
             </table>
            )}
            </div>
          : <center><h1>No Borrowed books left to Return</h1></center>
        : <center><h1>Login to continue <Link to={'/login'}>login</Link></h1></center>
      }
      { showPopup ? <Popup msg={msg} /> : <></>}
    </div>
  )
}

export default Return
