import React, { useState } from "react";
import { Input, Button, Tooltip } from "antd";
import Blockies from "react-blockies";
import { SendOutlined } from "@ant-design/icons";
import { parseEther } from "@ethersproject/units";
import { Transactor } from "../helpers";
import Wallet from "./Wallet";

{/* modify to own input, antd customization too restrictive */}
export default function Faucet(props) {
  const [address, setAddress] = useState();

  let blockie;
  if (address && typeof address.toLowerCase === "function") {
    blockie = <Blockies seed={address.toLowerCase()} size={8} scale={4} />;
  } else {
    blockie = <div />;
  }

  const tx = Transactor(props.localProvider);

  return (
    <span className='faucet'>
      <Input
        size="middle"
        placeholder="local faucet"
        prefix={blockie}
        value={address}
        bordered={true}
        onChange={e => {
          setAddress(e.target.value);
        }}
        suffix={
          <Tooltip title="Faucet: Send local ether to an address.">
            <Button
              onClick={() => {
                tx({
                  to: address,
                  value: parseEther("0.01"),
                });
                setAddress("");
              }}
              shape="circle"
              icon={<SendOutlined />}
            />
            <Wallet color="#888888" provider={props.localProvider} ensProvider={props.ensProvider} price={props.price} />
          </Tooltip>
        }
      />
    </span>
  );
}
