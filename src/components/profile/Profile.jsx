import React, { useEffect, useState } from 'react'
import {isLoggedIn, user} from '../login/Login'
import { Link, useNavigate } from 'react-router-dom'
import './profile.css'
import Navmenu from '../navmenu/Navmenu';
import axios from 'axios';
import BackBtn from '../backbtn/BackBtn';
import Loading  from '../loading/Loading';

function Profile() {
  const navigate = useNavigate()
  const email = user.email
  const [details, setDetails] = useState(user)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchData(){
      await axios.get(`https://libraryapp-backend.onrender.com/user/profile/${email}`)
      .then((res) => {
        setDetails(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        alert('Unexpected server error\nTry again later')
      })
    }
    fetchData()
  }, [email])

  return (
    <>
    <Navmenu/>
    <BackBtn/>
    <div style={{display : 'flex', justifyContent: 'center', alignContent : 'center'}}>
    {
    isLoggedIn ? 
    loading ? <center><br /><br /><br /><Loading/></center>
    :
    <div className='profile'>
      <div>
      <div className='details'><h3>Name :</h3><h3> {details.name}</h3></div>
      <div className='details'><h3>Email :</h3><h3> {details.email} </h3></div>
      <div className='details'><h3>Points :</h3><h3> {details.points} </h3></div>
      <center><button onClick={() => {navigate('/changeName', {state : details})}} id='updbtn'>Update name</button></center>
      </div>
      <div id='lended'>
        <h3 className='head'>Lended</h3>{(details.lended === undefined) 
        ? <center>No books lended</center>
        : <div>
        { 
          details.lended.map((book, index) => 
            <table key={index} style={{width: '17rem'}}>
              <tbody>
              <tr>
                <td><b><p id='bookName'>{book.name}</p></b></td>
                <td rowSpan={2}><p id='bookCount'>X {book.bookCount}</p></td>
              </tr>
              <tr><td><p id='bookAuthor'>{book.author}</p></td></tr>
              </tbody>
            </table>
        )}
        </div>
        }
      </div>
      <div id='lended' style={{right : '30rem'}}>
        <h3 className='head'>Borrowed</h3>{(details.borrowed === undefined) 
        ? <center>No books borrowed</center>
        : <div >
        { 
          details.borrowed.map((book, index) => 
            <table key={index} style={{width: '17rem'}}>
              <tbody>
              <tr><td><b><p id='bookName'>{book.name}</p></b></td></tr>
              <tr><td><p id='bookAuthor'>{book.author}</p></td></tr>
              <tr><td><p id='bookReturned'>{book.returned ? 'Book returned' : 'Book not returned'}</p></td></tr>
              <tr><td><center><button style={{display : book.returned ? 'none' : 'block'}} onClick={() => {navigate('/return')}}>Return</button></center></td></tr>
              </tbody>
            </table>
        )}
        </div>
        }
      </div>
    </div>
    : <center><h1>Login to view profile <Link to={'/login'}>Login</Link></h1></center>
    }
    </div>
    </>
  )
}

export default Profile
