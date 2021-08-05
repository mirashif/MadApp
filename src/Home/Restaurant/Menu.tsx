import React, { useRef, useState } from "react";
import Animated from "react-native-reanimated";
import { onScrollEvent, useValue } from "react-native-redash/lib/module/v1";

import { SafeArea } from "../../components";

import Content, { defaultTabs } from "./Content";
import Header from "./Header";

const Menu = () => {
  // const theme = useTheme();
  const scrollView = useRef<Animated.ScrollView>(null);
  const [tabs, setTabs] = useState(defaultTabs);
  const y = useValue(0);
  const onScroll = onScrollEvent({ y });

  return (
    <SafeArea>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollView}
        scrollEventThrottle={1}
        {...{ onScroll }}
      >
        <Content
          onMeasurement={(index, tab) => {
            tabs[index] = tab;
            setTabs([...tabs]);
          }}
          {...{ y }}
        />
      </Animated.ScrollView>
      <Header
        title="Cheez"
        image="https://source.unsplash.com/a66sGfOnnqQ"
        {...{ y, tabs, scrollView }}
      />
    </SafeArea>
  );
};

export default Menu;
