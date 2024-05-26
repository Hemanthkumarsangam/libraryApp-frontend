import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './admin.css'
import Navmenu from '../navmenu/Navmenu';
import Popup from '../popup/Popup';
import Loading from '../loading/Loading';

function Admin() {
  const [lend, setLend] = useState([]);
  const [borrow, setBorrow] = useState([]);
  const [ret, setRet] = useState([]);
  const [showPopup, setShowPopup] = useState(false)
  const [msg, setMsg] = useState('')  
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [pass, setPass] = useState('')

  function handleForm(e){
    e.preventDefault()
    if(pass === process.env.REACT_APP_PASSWORD){
      setIsAdmin(true)
      return
    }
    popup('Invalid password')
    console.log(process.env.REACT_APP_PASSWORD)
  }

  function popup(data){
    setMsg(data)
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false)
      window.location.reload()
    }, 6000)
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/getRequests`);
        const reqs = res.data.content;

        const lendRequests = [];
        const borrowRequests = [];
        const returnRequests = [];

        reqs.forEach((req) => {
          if (req.reqType === 'Lend') lendRequests.push(req);
          if (req.reqType === 'Borrow') borrowRequests.push(req);
          if (req.reqType === 'Return') returnRequests.push(req);
        });

        setLend(lendRequests);
        setBorrow(borrowRequests);
        setRet(returnRequests);
        setLoading(false)
      } catch (err) {
        setLoading(false)
        popup('Unexpected server error\nTry again later')
        console.log(err)
      }
    }

    fetchData();
  }, []);

  async function handleDecline(book){
    setLoading(true)
    await axios.delete(`${process.env.REACT_APP_BASE_URL}/user/declineReq/${book.rid}`)
    .then(() => {
      popup('Declined successfully')
      setLoading(false)
    })
    .catch((err) => {
      setLoading(false)
      popup('Unexpected server error\nTry again later')
      console.log(err)
    })
  }

  async function grantLend(book) {
    try {
      setLoading(true);
      await axios.put(`${process.env.REACT_APP_BASE_URL}/user/grantLend`, { book });
      await axios.post(`${process.env.REACT_APP_BASE_URL}/book/lend`, {
        name: book.name,
        author: book.author,
        bookCount: book.bookCount,
      });
      popup(`Lend Request accepted\n${book.bookCount * 4} points rewarded to the user`);
    } catch (err) {
      popup('Unexpected server error\nTry again later');
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  
  async function grantBorrow(book){
    try {
      setLoading(true) 
      const borrowRes = await axios.put(`${process.env.REACT_APP_BASE_URL}/user/grantBorrow`, { book })  
      if(borrowRes.data.message === "Book already borrowed"){popup(borrowRes.data.message)}
      else{
        popup(borrowRes.data.message+'\n 1 point rewarded to the user')
        await axios.post(`${process.env.REACT_APP_BASE_URL}/book/borrow`, {
          name: book.name, author: book.author
        })
      }      
    } catch (error) {
      popup('Unexpected server error\nTry again later');
      console.log(error);      
    } finally {
      setLoading(false)
    }
  }

  async function grantReturn(book){
    try {
      setLoading(true)
      const res = await axios.put(`${process.env.REACT_APP_BASE_URL}/user/grantReturn`, {...book})
      popup(`User rewarded with ${res.data.message} points`)
      const ress = await axios.put(`${process.env.REACT_APP_BASE_}/book/return`,{name: book.name, author: book.author})
      popup(ress.data.message)
    } catch (error) {
      popup('Unexpected server error\nTry again later');
      console.log(error);  
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navmenu/>
    { isAdmin ?
      <div className='admin'>
      <div className="lendReq">
        <h1>Lend Requests</h1>
        <div className="reqCont">
          {lend.map((book, index) => (
          <div className="req" key={index}>
            <p>Book name: {book.name}</p>
            <p>No. of books: {book.bookCount}</p>
            <p>User email: {book.email}</p>
            <p>Request id: {book.rid}</p>
            <button onClick={() => {grantLend(book)}}>Grant</button>
            <button onClick={() => {handleDecline(book); setLoading(true)}}>Decline</button>
          </div>
        ))}
        </div>
      </div>
      <div className="borrowReq">
        <h1>Borrow Requests</h1>
        <div className="reqCont">
          {borrow.map((book, index) => (
          <div className="req" key={index}>
            <p>Book name: {book.name}</p>
            <p>User email: {book.email}</p>
            <p>Request id: {book.rid}</p>
            <button onClick={() => {grantBorrow(book)}}>Grant</button>
            <button onClick={() => {handleDecline(book); setLoading(true)}}>Decline</button>
          </div>
        ))}
        </div>
      </div>
      <div className="returnReq">
        <h1>Return Requests</h1>
        <div className="reqCont">
          {ret.map((book, index) => (
          <div className="req" key={index}>
            <p>Book name: {book.name}</p>
            <p>User email: {book.email}</p>
            <p>Due date: {book.date.slice(8, 10)+'/'+book.date.slice(5, 7)+'/'+book.date.slice(0, 4)}</p>
            <p>Request id: {book.rid}</p>
            <button onClick={() => {grantReturn(book)}}>Grant</button>
            <button onClick={() => {handleDecline(book); setLoading(true)}}>Decline</button>
          </div>
        ))}
        </div>
      </div>
      </div>
      :
      <form onSubmit={handleForm} className='adminForm'><br /><br />
        <input type="password" required onChange={e=>{setPass(e.target.value)}} value={pass} maxLength='12' placeholder='PASSWORD'/>
        <button>Submit</button>
      </form>
    }
      {loading ? <div id='load'><Loading/></div> : <></>}
      { showPopup ? <Popup msg={msg} /> : <></>}
    </>
  );
}

export default Admin;
