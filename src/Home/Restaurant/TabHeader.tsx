import React, { useState } from "react";

import { TabModel } from "./Menu";
import Tabs from "./Tabs";

interface TabHeaderProps {
  tabs: TabModel[];
}

const TabHeader = ({ tabs }: TabHeaderProps) => {
  const [measurements, setMeasurements] = useState<number[]>(
    new Array(tabs.length).fill(0)
  );

  return (
    <Tabs
      onMeasurement={(i, m) => {
        measurements[i] = m;
        setMeasurements([...measurements]);
      }}
      {...{ tabs }}
    />
  );
};

export default TabHeader;
