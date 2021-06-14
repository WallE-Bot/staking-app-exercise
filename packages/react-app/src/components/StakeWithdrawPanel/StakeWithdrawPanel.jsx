import React, { useState, useEffect } from 'react';
import './StakeWithdrawPanel.css';
import EtherInput from '../../components/EtherInput.jsx';
import { uuid } from 'uuidv4';

export default function StakeWithdrawPanel({ price }) {

  const [panelMode, setPanelMode] = useState('Stake');

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

  const handleFormSubmit = e => {
    e.preventDefault();
  }

  const generatePanelForm = () => {
    return (
      <form className='panel-form'>
        {/* modify input for withdrawal constraints */}
        <EtherInput
          autoFocus={false}
          name={panelMode}
          price={price}
        />
        <input
          className='panel-submit'
          type='submit'
          onSubmit={handleFormSubmit}
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
