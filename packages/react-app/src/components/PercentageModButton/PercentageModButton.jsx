import React from 'react';

const percentageModButton = ({ percentile, onClickHandler }) => {
  const percentileString = percentile * 100 + '%';

  return (
    <button
      className='percentage-mod-button'
      onClick={onClickHandler(percentile)}
    >
      {percentileString}
    </button>
  );

};

export default percentageModButton;
