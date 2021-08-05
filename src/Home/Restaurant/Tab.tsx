import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";

import { makeStyles, Text } from "../../components";

interface TabProps {
  color: string;
  name: string;
  onMeasurement?: (measurement: number) => void;
  onPress?: () => void;
}

const Tab = ({ name, color, onMeasurement, onPress }: TabProps) => {
  const styles = useStyles();

  return (
    <TouchableWithoutFeedback {...{ onPress }}>
      <View
        onLayout={
          onMeasurement
            ? ({
                nativeEvent: {
                  layout: { width },
                },
              }) => onMeasurement(width)
            : undefined
        }
        style={styles.container}
      >
        <Text style={[styles.text, { color }]}>• {name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Tab;

const useStyles = makeStyles(() => ({
  container: {
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "Bold",
    fontSize: 18,
  },
}));
