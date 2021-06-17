import React, { useState, useEffect } from "react";
import { Address, Balance } from "../../components";
import { uuid } from 'uuidv4';
import './StakeEventsPanel.css';

export default function StakeEventsPanel({
  stakeEvents,
  ensProvider
}) {
  const [collapsed, toggleCollapsed] = useState(false);

  const handleTabClick = () => {
    const newCollapsed = !collapsed;
    toggleCollapsed(newCollapsed);
  }

  const generateCollapsedClass = () => {
    return collapsed ? ' collapsed-events' : '';
  }

  useEffect(() => {

  }, []);

  const generateStakeEvents = () => {
    const stakeEventItems = stakeEvents.map(event => {
      return (
        <li
          className='stake-events-list-item'
          key={uuid()}
        >
          <Address
            value={event[0]}
            ensProvider={ensProvider}
            fontSize={16}
          /> => 
          <Balance
            balance={event[1]}
          />
        </li>
      )
    });

    return (
      <ul className='stake-events-list'>
        {stakeEventItems}
      </ul>
    );
  }

  return (
    <div
      className={`stake-events-panel${generateCollapsedClass()}`}
    >
      {generateStakeEvents()}
      <span
        className={`stake-events-panel-tab${generateCollapsedClass()}`}
        onClick={handleTabClick}
      >
        stake events
      </span>
    </div>
  )
}
