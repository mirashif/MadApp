import React, { RefObject, useState } from "react";
import Animated, {
  Value,
  interpolateNode,
  useCode,
  and,
  block,
  cond,
  greaterOrEq,
  lessOrEq,
  set,
} from "react-native-reanimated";
import MaskedView from "@react-native-community/masked-view";
import { withTransition } from "react-native-redash/lib/module/v1";

import { TabModel } from "./constants";
import Tabs from "./Tabs";

const PADDING_LEFT = 18;

interface TabHeaderProps {
  y: Animated.Node<number>;
  tabs: TabModel[];
  scrollView: RefObject<Animated.ScrollView>;
}

const TabHeader = ({ y, tabs, scrollView }: TabHeaderProps) => {
  const index = new Value<number>(0);
  const [measurements, setMeasurements] = useState<number[]>(
    new Array(tabs.length).fill(0)
  );
  const indexTransition = withTransition(index);

  const translateX = interpolateNode(indexTransition, {
    inputRange: tabs.map((_tab, i) => i),
    outputRange: measurements.map((_, i) => {
      return (
        -1 *
          measurements
            .filter((_measurement, j) => j < i)
            .reduce((acc, m) => acc + m, 0) +
        PADDING_LEFT
      );
    }),
  });

  useCode(
    () =>
      block(
        tabs.map((tab, i) =>
          cond(
            i === tabs.length - 1
              ? greaterOrEq(y, tab.anchor)
              : and(
                  greaterOrEq(y, tab.anchor),
                  lessOrEq(y, tabs[i + 1].anchor)
                ),
            set(index, i)
          )
        )
      ),
    [index, tabs, y]
  );

  return (
    // <Animated.View
    //   style={{
    //     transform: [{ translateX }],
    //   }}
    // >
    //   <Tabs
    //     onPress={(i) => {
    //       if (scrollView.current) {
    //         scrollView.current.getNode().scrollTo({ y: tabs[i].anchor + 1 });
    //       }
    //     }}
    //     onMeasurement={(i, m) => {
    //       measurements[i] = m;
    //       setMeasurements([...measurements]);
    //     }}
    //     {...{ tabs, translateX }}
    //   />
    // </Animated.View>
    <Animated.View style={[styles.container, { opacity }]}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{ translateX }],
        }}
      >
        <Tabs
          onMeasurement={(i, m) => {
            measurements[i] = m;
            setMeasurements([...measurements]);
          }}
          {...{ tabs, translateX }}
        />
      </Animated.View>
      <View>
        <Animated.View
          style={[
            style,
            Platform.OS === "android"
              ? {
                  backgroundColor: "transparent",
                  borderColor: "black",
                  borderWidth: 1,
                }
              : {},
          ]}
        />
      </View>
      <MaskedView style={StyleSheet.absoluteFill} maskElement={maskElement}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            transform: [{ translateX }],
          }}
        >
          <Tabs
            active
            onPress={(i) => {
              if (scrollView.current) {
                scrollView.current
                  .getNode()
                  .scrollTo({ y: tabs[i].anchor + 1 });
              }
            }}
            {...{ tabs, translateX }}
          />
        </Animated.View>
      </MaskedView>
    </Animated.View>
  );
};

export default TabHeader;
