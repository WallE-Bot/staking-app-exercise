import React from 'react';
import Balance from '../../components/Balance.jsx';
import './TimeLeft.css';
const humanizeDuration = require("humanize-duration");

const timeLeft = ({ timeLeft }) => {
  return (
    <div className='time-left' style={{padding:8,marginTop:32}}>
      <h2 className='time-left-text'>Time Left:</h2>
      <p className='time-left-clock'>
        {timeLeft && humanizeDuration(timeLeft.toNumber()*1000)}
      </p>
    </div>
  );
}

export default timeLeft;
