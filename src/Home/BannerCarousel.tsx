import React, { useState } from "react";
import { Dimensions } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

import type { Theme } from "../components";
import { Text, Box, makeStyles } from "../components";

interface ICarouselItem {
  title: string;
  text: string;
}

const BannerCarousel = () => {
  const styles = useStyles();
  const { width: windowWidth } = Dimensions.get("window");

  const [activeIndex, setActiveIndex] = useState(0);

  const carouselItems = [
    {
      title: "Item 1",
      text: "Text 1",
    },
    {
      title: "Item 2",
      text: "Text 2",
    },
    {
      title: "Item 3",
      text: "Text 3",
    },
    {
      title: "Item 4",
      text: "Text 4",
    },
    {
      title: "Item 5",
      text: "Text 5",
    },
  ];

  const _renderItem = ({
    item,
    index,
  }: {
    item: ICarouselItem;
    index: number;
  }) => {
    return (
      <Box style={styles.wideBanner}>
        <Text style={{ fontSize: 30 }}>{item.title}</Text>
        <Text>{item.text}</Text>
      </Box>
    );
  };

  return (
    <Box style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
      <Carousel
        layout={"default"}
        data={carouselItems}
        sliderWidth={windowWidth}
        itemWidth={windowWidth}
        renderItem={_renderItem}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      <Pagination
        activeDotIndex={activeIndex}
        dotsLength={carouselItems.length}
        dotColor="white"
        inactiveDotColor="transparent"
        inactiveDotScale={1}
        containerStyle={styles.pagination}
        dotStyle={styles.dot}
      />
    </Box>
  );
};

export default BannerCarousel;

const useStyles = makeStyles((theme: Theme) => ({
  wideBanner: {
    backgroundColor: "purple",
    height: 130,
    borderRadius: theme.borderRadii.l,
    overflow: "hidden",
    marginHorizontal: theme.spacing.screen,
  },
  wideBannerImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  pagination: {
    position: "absolute",
    bottom: 0,
    paddingVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "white",
  },
}));
