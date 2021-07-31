import React from "react";
import { ScrollView, Image } from "react-native";

import {
  Box,
  Text,
  SafeArea,
  useTheme,
  CircularIcon,
  makeStyles,
  Button,
  Icon,
} from "../components";

const madAppLogo = {
  src: require("../../assets/mad-logo.png"),
  height: 170,
  width: 169,
};

export const assets = [madAppLogo.src];

const Get100 = () => {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="screen">
          <Box style={styles.card}>
            <Image style={styles.cardImage} source={madAppLogo.src} />
          </Box>

          <Box p="screen">
            <Box
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Text style={{ fontSize: 55 }}>🥳</Text>
              <Box style={{ marginLeft: 15 }}>
                <Text style={{ fontFamily: "Bold", fontSize: 26 }}>
                  Invite a friend
                </Text>
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontFamily: "Bold",
                    fontSize: 36,
                  }}
                >
                  & Get ৳100
                </Text>
              </Box>
            </Box>

            <Box style={styles.step}>
              <CircularIcon name="send" size={35} color="primary" />
              <Box style={styles.stepDetails}>
                <Text style={styles.stepTitle}>ENJOY</Text>
                <Text style={styles.stepDescription}>
                  After they order, you will receive a ৳100 promo code.
                </Text>
              </Box>
            </Box>

            <Box style={styles.step}>
              <CircularIcon name="heart" size={35} color="primary" />
              <Box style={styles.stepDetails}>
                <Text style={styles.stepTitle}>INVITE</Text>
                <Text style={styles.stepDescription}>
                  Share your referral code with friends & they get a ৳100 promo
                  code!
                </Text>
              </Box>
            </Box>
          </Box>

          {/* My coupon share */}
          <Box
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: 30,
              borderRadius: theme.borderRadii.l,
            }}
          >
            <Box
              style={{
                flex: 1,
                borderRightWidth: 1,
                borderRightColor: theme.colors.gray,
                marginBottom: theme.spacing.l,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: "Bold",
                  fontSize: 25,
                  color: "#000000",
                }}
              >
                RABBILITV
              </Text>
            </Box>
            <Button
              onPress={() => console.log("My coupon share")}
              size="lg"
              variant="text"
            >
              <Icon name="send" size={17} color={theme.colors.primary} />
              <Box width={7} />
              <Text>Share</Text>
            </Button>
          </Box>

          {/* External share */}
          <Box
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: theme.spacing.l,
            }}
          >
            <Text>TODO: External share icon buttons</Text>
          </Box>

          {/* My invites */}
          <Box px="xl" my="xl">
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Bold",
                marginBottom: theme.spacing.m,
              }}
            >
              💌 My Invites
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Normal",
                color: theme.colors.gray,
              }}
            >
              None of your friends signed up yet! They will show up here once
              they do.
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </SafeArea>
  );
};

export default Get100;

const useStyles = makeStyles(() => ({
  card: {
    backgroundColor: "#D92955",
    alignItems: "center",
    justifyContent: "center",
    height: 210,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  cardImage: {
    height: madAppLogo.height,
    width: madAppLogo.width,
  },
  step: {
    flexDirection: "row",
    marginBottom: 24,
  },
  stepDetails: {
    marginLeft: 7,
    flex: 1,
  },
  stepTitle: {
    fontFamily: "Normal",
    fontSize: 17,
    color: "#000000",
  },
  stepDescription: {
    fontFamily: "Normal",
    fontSize: 14,
    color: "#939393",
  },
}));
