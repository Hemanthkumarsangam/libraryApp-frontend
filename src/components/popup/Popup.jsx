import React, { useEffect, useState } from 'react';
import './popup.css';

function Popup({ msg }) {
  const [msg1, msg2] = msg.split('\n');
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    const showTimeout = setTimeout(() => {
      setShow(true);
    }, 10);

    const hideTimeout = setTimeout(() => {
      setShow(false);
    }, 5010);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []); 

  return (
    <div id='popup'>
      <h3 style={{ transform: show ? 'scaleX(1)' : 'scaleX(0)' }}>{msg1} <br /> {msg2}</h3>
    </div>
  )
}

export default Popup;
