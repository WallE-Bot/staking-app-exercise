import React from 'react';
import './PercentageModButton.css';

const percentageModButton = ({ percentile, onClickHandler }) => {
  const percentileString = percentile * 100 + '%';

  return (
    <input
      className='percentage-mod-button'
      onClick={() => onClickHandler()}
      type='button'
      value={percentileString}
    />
  );

};

export default percentageModButton;
