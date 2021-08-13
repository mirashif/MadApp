import React, { useRef, useState } from "react";
import Animated from "react-native-reanimated";
import { onScrollEvent, useValue } from "react-native-redash/lib/module/v1";

import { SafeArea } from "../../components";
import FloatingCart from "../FloatingCart";

import Content, { defaultTabs } from "./Content";
import Header from "./Header";

const Menu = () => {
  const scrollView = useRef<Animated.ScrollView>(null);
  const [tabs, setTabs] = useState(defaultTabs);
  const y = useValue(0);
  const onScroll = onScrollEvent({ y });

  return (
    <SafeArea>
      <FloatingCart insetBottom />

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
