import React, { useState, useEffect } from "react";
import { Input } from "antd";

// modify for withdrawal constraints
export default function EtherInput(props) {
  const {
    autoFocus,
    name,
    price,
    mode,
    value,
    setMode,
    setValue,
    onModeChangeHandler
  } = props;

  useEffect(() => {

  },[])

  const generatePrefix = () => {
    return mode === 'USD'
      ? '$'
      : 'Ξ';
  }

  const generateAddonAfter = () => {
    const text = mode === 'USD'
      ? "USD"
      : "ETH";

    return (
      <div
        style={{ cursor: "pointer" }}
        onClick={() => onModeChangeHandler()}
      >
        {text}🔀
      </div>
    );
  }

  const handleInputChange = e => {
    const newValue = e.target.value;
    setValue(newValue);
  }

  return (
    <Input
      placeholder={"amount in " + mode}
      autoFocus={autoFocus}
      prefix={generatePrefix()}
      value={value}
      addonAfter={generateAddonAfter()}
      onChange={handleInputChange}
      name={name}
    />
  );
}
