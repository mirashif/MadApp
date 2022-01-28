import { observer } from "mobx-react";
import React, { useState } from "react";
import { Dimensions, Image } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

import type { Theme } from "../components";
import { Box, makeStyles } from "../components";
import { useAppState } from "../state/StateContext";
import type { Banner, BannerStore } from "../state/store/BannerStore";

const BannerCarousel = observer(() => {
  const styles = useStyles();
  const { width: windowWidth } = Dimensions.get("window");

  const banners: BannerStore = useAppState("banners");
  const bannersList: Banner[] = banners.all;

  const [activeIndex, setActiveIndex] = useState(0);

  // @ts-ignore
  // index is required by carousel library
  const _renderItem = ({ item, index }: { item: Banner; index: number }) => {
    const {
      data: { imageURI },
    } = item;

    return (
      <Box style={styles.wideBanner}>
        <Image
          source={{
            uri: imageURI,
          }}
          style={[styles.wideBannerImage, { height: windowWidth / 2.5 }]}
        />
      </Box>
    );
  };

  return (
    <Box style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
      <Carousel
        layout={"default"}
        data={bannersList}
        sliderWidth={windowWidth}
        itemWidth={windowWidth}
        renderItem={_renderItem}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      <Pagination
        activeDotIndex={activeIndex}
        dotsLength={bannersList.length}
        dotColor="white"
        inactiveDotColor="transparent"
        inactiveDotScale={1}
        containerStyle={styles.pagination}
        dotStyle={styles.dot}
      />
    </Box>
  );
});

export default BannerCarousel;

const useStyles = makeStyles((theme: Theme) => ({
  wideBanner: {
    minHeight: 130,
    borderRadius: theme.borderRadii.l,
    overflow: "hidden",
    marginHorizontal: theme.spacing.screen,
  },
  wideBannerImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    backgroundColor: theme.colors.gray,
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
