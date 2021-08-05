import * as React from "react";
import { View, StyleSheet } from "react-native";

import Tab from "./Tab";
import { TabModel } from "./Menu";

const styles = StyleSheet.create({
  overlay: {
    // ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    backgroundColor: "white",
  },
});

interface TabsProps {
  tabs: TabModel[];
  active?: boolean;
  onMeasurement?: (index: number, measurement: number) => void;
  onPress?: (index: number) => void;
}

const Tabs = ({ tabs, active, onMeasurement, onPress }: TabsProps) => (
  <View style={styles.overlay}>
    {tabs.map((tab, index) => (
      <Tab
        key={index}
        onMeasurement={
          onMeasurement ? onMeasurement.bind(null, index) : undefined
        }
        color={active ? "white" : "black"}
        onPress={onPress ? onPress.bind(null, index) : undefined}
        {...tab}
      />
    ))}
  </View>
);

export default Tabs;
