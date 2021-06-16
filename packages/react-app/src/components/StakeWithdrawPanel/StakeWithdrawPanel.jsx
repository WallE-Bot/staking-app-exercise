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
  const [mode, setMode] = useState('USD');
  const [value, setValue] = useState(null);

  useEffect(() => {

  }, []);

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

  const calculateEtherValue = () => {
    const etherValue
      = mode === "USD"
      ? parseFloat(value) / price
      : value;

    return etherValue;
  }

  // no price change confirmation before processing amount
  const handleFormSubmit = e => {
    e.preventDefault();
    const etherValue = parseEther(calculateEtherValue()+'');

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
    const newValue = value * percentile;
    setValue(newValue);
    console.log(newValue);
  }

  const handleModeChange = () => {
    console.log('here');
    const newMode =
      mode === 'USD'
      ? 'ETH'
      : 'USD';

    const newValue =
      newMode === 'USD'
      ? value * price
      : value / price;

    setValue(newValue.toString());
    setMode(newMode);
    console.log(newValue);
  }

  const generatePercentageModButtons = () => {
    return [.25, .5, .75, 1].map(percentile => {
      return (
        <PercentageModButton
          key={uuid()}
          percentile={percentile}
          onClickHandler={handlePercentileClick}
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
          setMode={setMode}
          setValue={setValue}
          onModeChangeHandler={handleModeChange}
          value={value}
          mode={mode}
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
