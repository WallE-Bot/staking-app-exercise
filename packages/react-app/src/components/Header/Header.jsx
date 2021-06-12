import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { PageHeader } from "antd";

export default function Header() {
  return (
    <a href="/" /*target="_blank" rel="noopener noreferrer"*/>
      <PageHeader
        title="Staking App Demo"
        subTitle="practice exercise"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
