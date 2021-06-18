import React, { useState, useEffect } from 'react';
import './FaucetPanel.css';
import { Faucet, Ramp, GasGauge } from '../../components';

// make generic panel component
export default function FaucetPanel({
  localProvider,
  price,
  ensProvider,
  address,
  networks,
  gasPrice
}) {

  const [collapsed, toggleCollapsed] = useState(false);

  const handleTabClick = () => {
    const newCollapsed = !collapsed;
    toggleCollapsed(newCollapsed);
  }

  const generateCollapsedClass = () => {
    return collapsed ? ' collapsed-faucet' : '';
  }

  useEffect(() => {

  }, []);

  return (
    <div
      className={`faucet-panel${generateCollapsedClass()}`}
    >
      <span
        className={`faucet-panel-tab${generateCollapsedClass()}`}
        onClick={handleTabClick}
      >
        faucet
      </span>
     <section
        className='faucet-helpers'>
       <Ramp price={price} address={address} networks={networks}/>
       <GasGauge gasPrice={gasPrice} />
     </section>
      <Faucet
        localProvider={localProvider}
        price={price}
        ensProvider={ensProvider}
      />
    </div>
  );

}
