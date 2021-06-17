import React from 'react';
import Balance from '../../components/Balance.jsx';
import './TimeLeft.css';
const humanizeDuration = require("humanize-duration");

const timeLeft = ({ timeLeft, executeContract }) => {
  return (
    <div className='time-left' style={{padding:8,marginTop:32}}>
      <h2 className='time-left-text'>Time Remaining</h2>
      <p className='time-left-clock'>
        {timeLeft && humanizeDuration(timeLeft.toNumber()*1000)}
      </p>
      {/* move later to a timeRemainingContainer */}
      <p className='help'>?</p>
    </div>
  );
}

export default timeLeft;
