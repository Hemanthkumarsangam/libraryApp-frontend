import React from 'react';
import './home.css';
import Navmenu from '../navmenu/Navmenu';
import { Link } from 'react-router-dom';
import './home.css'
import { isLoggedIn } from '../login/Login';

function HomePage() {

  return (
    <div className='home'>
      <Navmenu/>
      <center><br /><br /><br /><br /><br /><br /><br />
      <div className="actionContainer">
        <div id="lend"><Link to={'/lend'} id='link'>Lend</Link></div>
        <div id="borrow"><Link to={'/borrow'} id='link'>Borrow</Link></div>
        <div id="return"><Link to={'/return'} id='link'>Return</Link></div>
      </div>
      </center>
      {isLoggedIn ? <div id="saleHolder">
        <Link to={'/sale'}>Sale</Link>
      </div> : <></>}
    </div>
  )
}

export default HomePage;