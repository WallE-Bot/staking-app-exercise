import React from 'react';
import Balance from '../../components/Balance.jsx';
import './UserStake.css';
import EtherInput from '../../components/EtherInput.jsx';

const userStake = ({ balanceStaked, stakerContractBalance, price }) => {
  const userStakePercentage =
    stakerContractBalance || balanceStaked === 0
    ? 0
    : (balanceStaked/stakerContractBalance * 100).toFixed(0);

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
      <form>
        <label htmlFor='user-stake-input'>Stake</label>
        <EtherInput
          autoFocus={false}
          name='user-stake-input'
          price={price}
        />
      </form>
    </div>
  );
}

export default userStake;
