import React, { useState, useEffect } from 'react';
import './StakeWithdrawPanel.css';
import EtherInput from '../../components/EtherInput.jsx';
import { PercentageModButton } from '../../components/';
import { uuid } from 'uuidv4';
import { parseEther } from "@ethersproject/units";

export default function StakeWithdrawPanel({
    price,
    withdrawFunction,
    stakeFunction
  }) {

  const [panelMode, setPanelMode] = useState('Stake');
  // form input value for controlled form
  // convert to Ether for parseEther - modify later
  // when move to controlled form and externalizing state
  const [valueInEther, setValueInEther] = useState('0');

  useEffect(() => {

  }, []);

  const handleInputChange = (value) => {
    setValueInEther(value);
  }

  const togglePanelMode = type => {
    const panelMode = type;
    console.log(panelMode);
    setPanelMode(panelMode);
  }

  const handlePanelClick = e => {
    const panelMode = e.target.value;
    setPanelMode()
  }

  const generatePanels = () => {
    return ['Stake', 'Withdraw'].map(type => {
      const selected = panelMode === type
        ? ' selected'
        : '';

      return (
        <label
          key={uuid()}
          className={`panel-toggle${selected}`}
          onClick={() => togglePanelMode(type)}
          htmlFor={type.toLowerCase()}
        >
          {type}
        </label>
      )
    })
  }

  // no price change confirmation before processing amount
  const handleFormSubmit = e => {
    e.preventDefault();
    const etherValue = parseEther(valueInEther+'');

    // if in stake mode
    if (panelMode == 'Stake') {
      stakeFunction(etherValue);
    };

    // if in withdraw mode
    if (panelMode === 'Withdraw') {
      withdrawFunction(etherValue);
    }
  }

  const handlePercentileClick = percentile => {
    const newValueInEther = valueInEther * percentile;
    setValueInEther(newValueInEther);
    console.log(valueInEther);
  }

  const generatePercentageModButtons = () => {
    return [.25, .5, .75, 1].map(percentile => {
      return (
        <PercentageModButton
          key={uuid()}
          percentile={percentile}
          onClickHandler={() => handlePercentileClick(percentile)}
        />
      )
    });
  }

  const generatePanelForm = () => {
    return (
      <form
        className='panel-form'
        onSubmit={handleFormSubmit}
      >
        {/* modify input for withdrawal constraints */}
        <EtherInput
          autoFocus={false}
          name={panelMode}
          price={price}
          onChangeHandler={handleInputChange}
        />
        {generatePercentageModButtons()}
        <input
          className='panel-submit'
          type='submit'
        />
      </form>
    );
  }

  return (
    <section className='stake-withdraw-panel'>
      <div className='stake-withdraw-toggle'>
        {generatePanels()}
      </div>
      {generatePanelForm()}
    </section>
  );
}
