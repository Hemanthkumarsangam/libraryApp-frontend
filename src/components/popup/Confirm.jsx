import React, { useEffect, useState } from 'react'
import './popup.css'

function Confirm({ msg, onConfirm, attr}) {
    const [msg1, msg2] = msg.split('\n');
    const [show, setShow] = useState(false);

    useEffect(() => {
    const showTimeout = setTimeout(() => {
        setShow(true);
    }, 10);

    return () => {
        clearTimeout(showTimeout);
    };
    }, []); 

    function handleConfirm(){
        setShow(false);
        setTimeout(() => {
         onConfirm(attr);
        }, 10)
    }

    return (
    <div id='confirm'>
        <h3 style={{ transform: show ? 'scaleX(1)' : 'scaleX(0)' }}>{msg1} <br /> {msg2}
            <br /><button onClick={handleConfirm}>OK</button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => {setShow(false)}}>Cancel</button>
        </h3>
    </div>
    )
}

export default Confirm
