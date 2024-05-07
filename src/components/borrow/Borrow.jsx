import React, { useEffect, useState } from 'react'
import Navmenu from '../navmenu/Navmenu'
import './borrow.css'
import axios from 'axios';
import BackBtn from '../backbtn/BackBtn';
import { isLoggedIn, user } from '../login/Login';
import { Link, useNavigate } from 'react-router-dom';
import Loading  from '../loading/Loading';
import Popup from '../popup/Popup';

function Borrow() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [books, setBooks] = useState([])
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

  async function handleBorrow(book){
    setLoading(true)
    if(isLoggedIn){
      if(window.confirm(`Do you want to borrow the book ${book.name}`)){
        const name = book.name
        const author = book.author
        const email = user.email
        try {
          await axios.put('https://libraryapp-backend.onrender.com/user/borrow', {
            name, author, email
          })
          .then(async(res1) => {
            if(res1.data.message === 'book already borrowed'){
              popup('Book already borrowed')
              return
            }else if(res1.data.message === 'book borrowed successfully'){
              try {
                await axios.post('https://libraryapp-backend.onrender.com/book/borrow', {
                  name, author
                })
                .then((res2) => {
                  if(res2.data.message === 'Book not found'){
                    popup('Book not found');
                  }else{
                    popup('Book borrowed successfully\nBooking id: '+res2.data)
                    setTimeout(() => {
                      navigate(-1)
                    }, 6000)
                  }
                })
              } catch (error) {
                console.log(error)
                popup('Unexpected server error\nTry again later')
              }
            }
          })
        } catch (error) {
          console.log(error)
          popup('Unexpected server error\nTry again later')
        }
      }
    }else{
      if(window.confirm('Login to perform this action')){navigate('/login')}
      else {return}
    }
  }

  useEffect( () => {
    try {
      async function getNameSearch(){
        await axios.put('https://libraryapp-backend.onrender.com/book/nameSearch', {
            name
        })
        .then((res) => {
          setBooks(res.data);
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          popup('Unexpected server error\nTry again later') 
          console.error(err);
        })
      }
      getNameSearch()
    } catch (error) {
      console.log(error)
    }
  }, [name])

  return (
    <div className='borrow'>
      <Navmenu/>
      <BackBtn/>
      <center>
        <input type="search" id='search' onChange={(e) => {setName(e.target.value); setLoading(true)}} placeholder='Name of the book'/>
        {
          loading ? 
          <div>
            <br /><br /><Loading id='load'/>
          </div> 
          :<div className="bookContainer">
          {books.length !== 0 ?
            books.map((book, index) => 
              <table key={index} style={{width: '17rem'}}>
                  <tbody>
                      <tr>
                          <td><b><p id='bookName'>{book.name}</p></b></td>
                          <td rowSpan={2}><p id='bookCount'>available : <b>{book.bookCount}</b></p></td>
                      </tr>
                      <tr><td><p id='bookAuthor'>{book.author}</p></td></tr>
                      <tr><td colSpan={2}><center><button onClick={() => {handleBorrow(book)}}>Borrow</button></center></td></tr>
                  </tbody>
              </table>
            )
            : <h1>No books available</h1>
          }
          {isLoggedIn ? <div id="saleHolder">
        <Link to={'/sale'}>Sale</Link>
        </div> : <></>}
        </div>}
      </center>
      { showPopup ? <Popup msg={msg} /> : <></>}
    </div>
  )
}

export default Borrow
