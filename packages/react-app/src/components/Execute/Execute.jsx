import React from 'react';
import './Execute.css';

// appears after time runs out
const execute = ({ onClickHandler, timeLeft }) => {

  const generateButton = () => {
    return timeLeft > 0
      ? ''
      : (
        <button
          className='execute-button'
          onClick={onClickHandler}
        >
          Execute
        </button>
      );
  }

  return (
    <>
      {generateButton()}
    </>
  );

}

export default execute;
