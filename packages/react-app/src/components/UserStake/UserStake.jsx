import React from 'react';
import Balance from '../../components/Balance.jsx';
import './UserStake.css';
import EtherInput from '../../components/EtherInput.jsx';
import { formatEther } from "@ethersproject/units";

const userStake = ({ balanceStaked, stakerContractBalance }) => {
  console.log(balanceStaked, stakerContractBalance);

  const formatUserBalance = balanceStaked === undefined
    ? '0.0'
    : formatEther(balanceStaked);

  const formatStakerContractBalance = stakerContractBalance === undefined
    ? '0.0'
    : formatEther(stakerContractBalance);

  console.log(formatUserBalance, formatStakerContractBalance);

  const userStakePercentage =
    formatUserBalance === '0.0' || formatStakerContractBalance === '0.0'
    ? 0
    : (formatUserBalance/formatStakerContractBalance * 100).toFixed(0);

  return (
    <div className='user-stake' style={{padding:8}}>
      <div>You staked:</div>
      <Balance
        balance={balanceStaked}
        fontSize={64}
      />
      <span className='user-stake-percentage'>
        {userStakePercentage}%
      </span>
    </div>
  );
}

export default userStake;
