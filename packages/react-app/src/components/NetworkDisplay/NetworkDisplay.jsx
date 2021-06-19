import React from 'react';
import { Alert } from "antd";

const NetworkDisplay = ({
  localChainId,
  selectedChainId,
  networkName,
  network
}) => {

  const generateNetworkDisplay = () => {
    if(localChainId && selectedChainId && localChainId !== selectedChainId ){
      return (
        <div style={{zIndex:2, position:'absolute', right:5,top:58,padding:16}}>
          <Alert
            message={"⚠️ Wrong Network"}
            description={(
              <div>
                You have <b>{network(selectedChainId).name}</b> selected and you need to be on <b>{network(localChainId).name}}</b>.
              </div>
            )}
            type="error"
            closable={false}
          />
        </div>
      )
    }else{
      return (
        <div style={{zIndex:2, position:'absolute', right:5,top:58,padding:16}}>
          {networkName}
        </div>
      )
    }
  }

  return (
    <>
      {generateNetworkDisplay()}
    </>
  )

}

export default NetworkDisplay;
