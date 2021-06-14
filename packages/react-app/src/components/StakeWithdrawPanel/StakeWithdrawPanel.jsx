import React, { useState, useEffect } from 'react';
import './StakeWithdrawPanel.css';
import EtherInput from '../../components/EtherInput.jsx';
import { uuid } from 'uuidv4';

export default function StakeWithdrawPanel({ price }) {

  const [panelMode, setPanelMode] = useState('Stake');

  useEffect(() => {

  }, []);

  const togglePanelMode = e => {
    const panelMode = e.target.value;
    setPanelMode(panelMode);
  }

  const handlePanelClick = e => {
    const panelMode = e.target.value;
    setPanelMode()
  }

  const generatePanels = () => {
    return ['Stake', 'Withdraw'].map(type => {
      return (
        <label
          key={uuid()}
          className='panel-toggle'
          onClick={togglePanelMode}
          htmlFor={type.toLowerCase()}
        >
          {type}
        </label>
      )
    })
  }

  const generatePanelForm = () => {
    return (
      <form>
        <label htmlFor='user-stake-input'>{panelMode}</label>
        {/* modify input for withdrawal constraints */}
        <EtherInput
          autoFocus={false}
          name={panelMode}
          price={price}
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
