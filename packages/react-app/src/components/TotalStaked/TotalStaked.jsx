import React from 'react';
import Balance from '../../components/Balance.jsx';
import './TotalStaked.css';

const totalStaked = ({stakerContractBalance, threshold }) => {
  return (
    <div className='total-staked' style={{padding:8}}>
      <div>Total staked:</div>
      <Balance
        balance={stakerContractBalance}
        fontSize={64}
      />/<Balance
        balance={threshold}
        fontSize={64}
      />
    </div>
  );
}

export default totalStaked;
