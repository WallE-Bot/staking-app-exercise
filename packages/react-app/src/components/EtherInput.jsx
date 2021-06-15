import React, { useState, useEffect } from "react";
import { Input } from "antd";

// modify for withdrawal constraints
export default function EtherInput(props) {
  const { autoFocus, name, price, onChangeHandler } = props;

  const [mode, setMode] = useState('USD');
  const [value, setValue] = useState(null);

  const option = title => {
    return (
      <div
        style={{ cursor: "pointer" }}
        onClick={() => convert()}
      >
        {title}
      </div>
    );
  };

  let prefix;
  let addonAfter;
  if (mode === "USD") {
    prefix = "$";
    addonAfter = option("USD 🔀");
  } else {
    prefix = "Ξ";
    addonAfter = option("ETH 🔀");
  }

  useEffect(() => {

  },[])

  const convert = () => {
    const newMode =
      mode === 'USD'
      ? 'ETH'
      : 'USD';

    const newValue =
      newMode === 'USD'
      ? value * price
      : value / price;

    setValue(newValue);
    setMode(newMode);
  }

  const handleInputChange = e => {
    const newValue = e.target.value;
    const setValueFigure
      = mode === "ETH"
      ? newValue / price
      : newValue;

    setValue(setValueFigure);
    // current architecture has state internal atm, less friction to
    // maintain current pattern then externalize state and move to
    // more controlled form later
    onChangeHandler(value, mode);
  }

  return (
    <Input
      placeholder={"amount in " + mode}
      autoFocus={autoFocus}
      prefix={prefix}
      value={value}
      addonAfter={addonAfter}
      onChange={handleInputChange}
      name={name}
    />
  );
}
