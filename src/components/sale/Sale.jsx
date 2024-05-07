import React, { useCallback, useEffect, useState } from 'react'
import '../borrow/borrow.css'
import Navmenu from '../navmenu/Navmenu'
import BackBtn from '../backbtn/BackBtn'
import Loading  from '../loading/Loading'
import axios from 'axios'
import { isLoggedIn, user } from '../login/Login'
import { useNavigate } from 'react-router-dom'
import Popup from '../popup/Popup'

function Sale() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
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

  const handleError = useCallback((error) => {
    console.log(error);
    popup('Unexpected server error\nTry again later');
  }, []);

  useEffect(() => {
    async function fetchData(){
      try {
          const response = await axios.put(`https://libraryapp-backend.onrender.com/sales/getFromSale`, { name})
          setBooks(response.data)
      } catch (error) {
          handleError(error)
      }finally{
          setLoading(false)
      }
    }
    fetchData()
  }, [name, books, handleError])

  async function handleBuy(book){
    setLoading(true)
    try {
        if(!isLoggedIn){
            popup('Log in to perform this action')
            setTimeout(() => {
              navigate('/login')
            }, 5050)
            return
        }
        const email = user.email
        const userResponse = await axios.get(`https://libraryapp-backend.onrender.com/user/profile/${user.email}`)
        if(userResponse.data.points < book.price){
            popup('You doesn\'t have enough points to purchase this book')
            setTimeout(() => {
              navigate('/profile')
            }, 5050)
            return
        }
        await axios.put('https://libraryapp-backend.onrender.com/user/buy', { email, book })
        const saleBuy = await axios.put('https://libraryapp-backend.onrender.com/sales/buy', { book })
        popup('Book Booked Successfully\n'+saleBuy.data.message)
    } catch (error) {
        handleError(error)
    } finally {
        setLoading(false)
    }
 }

  return (
    <div className="sale">
      <Navmenu/>
      <BackBtn/>
      <center>
        <input type="search" id='search' placeholder='Name of the book' onChange={(e) => {setName(e.target.value); setLoading(true)}}/>
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
                          <td><p id='bookCount'><b>{book.bookCount > 0 ? 'available : '+book.bookCount : "Out of stock"}</b></p></td>
                      </tr>
                      <tr>
                        <td><p id='bookAuthor'>{book.author}</p></td>
                        <td><p id='bookCount'>{book.price}pts</p></td>
                      </tr>
                      {book.bookCount > 0 ? <tr><td colSpan={2}><center><button onClick={() => {handleBuy(book)}}>Buy</button></center></td></tr> : <></>
          }
                  </tbody>
              </table>
            )
            : <h1>No books available</h1>
          }
        </div>}
      </center>
      { showPopup ? <Popup msg={msg} /> : <></>}
    </div>
  )
}

export default Sale
