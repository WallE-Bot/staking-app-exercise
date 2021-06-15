import React, { useState, useEffect } from 'react';
import './StakeWithdrawPanel.css';
import EtherInput from '../../components/EtherInput.jsx';
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

  const handleInputChange = (value, mode) => {
    const convertedValue =
      mode === 'ETH'
      ? value
      : value / price;

    setValueInEther(convertedValue);
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

  const handleFormSubmit = e => {
    e.preventDefault();
    const etherValue = parseEther(valueInEther.toString());

    // if in stake mode
    if (panelMode == 'Stake') {
      stakeFunction(etherValue);
    };

    // if in withdraw mode
    if (panelMode === 'Withdraw') {
      withdrawFunction(etherValue);
    }
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
