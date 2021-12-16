import { observer } from "mobx-react";
import React from "react";
import { ScrollView, Image } from "react-native";

import type { Theme } from "../components";
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
import { useInvites } from "../state/hooks/useInvites";
import { useUser } from "../state/hooks/useUser";

import InviteItem from "./InviteItem";

const madAppLogo = {
  src: require("../../assets/mad-logo.png"),
  height: 170,
  width: 169,
};

export const assets = [madAppLogo.src];

const Get100 = observer(() => {
  const theme = useTheme();
  const styles = useStyles();

  const { invites } = useInvites();
  const { attributes } = useUser();

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="screen">
          <Box style={styles.card}>
            <Image style={styles.cardImage} source={madAppLogo.src} />
          </Box>

          {/* Invite friend */}
          <Box p="screen">
            <Box
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: theme.spacing.xl,
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

            {/* Invite friend steps */}
            <Box style={{ position: "relative" }}>
              <Box
                style={{
                  position: "absolute",
                  width: 2,
                  height: 60,
                  backgroundColor: theme.colors.primary,
                  left: 34 / 2 - 1,
                  top: 34,
                }}
              />
              <Box style={styles.step}>
                <CircularIcon name="send" size={34} color="white" />
                <Box style={styles.stepDetails}>
                  <Text style={styles.stepTitle}>ENJOY</Text>
                  <Text style={styles.stepDescription}>
                    After they order, you will receive a ৳100 promo code.
                  </Text>
                </Box>
              </Box>
              <Box style={styles.step}>
                <CircularIcon name="heart" size={34} color="white" />
                <Box style={styles.stepDetails}>
                  <Text style={styles.stepTitle}>INVITE</Text>
                  <Text style={styles.stepDescription}>
                    Share your referral code with friends & they get a ৳100
                    promo code!
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* My coupon share */}
          <Box style={styles.couponShare}>
            <Box style={styles.coupon}>
              <Text numberOfLines={1} style={styles.couponText}>
                {attributes?.referralCode}
              </Text>
            </Box>
            {/* TODO: Implement share */}
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

          {/* My invites */}
          <Box px="xl" my="xl">
            <Box
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: theme.spacing.l,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Bold",
                }}
              >
                💌 My Invites
              </Text>
              <Box style={styles.inviteCount}>
                <Text
                  style={{
                    color: theme.colors.primaryContrast,
                    fontSize: 9,
                    fontFamily: "Normal",
                  }}
                >
                  {invites.length}
                </Text>
              </Box>
            </Box>

            {/* Empty state */}
            {invites.length === 0 && (
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
            )}

            {/* Not Empty state */}
            {invites.map((invite) => (
              <InviteItem
                key={invite.data.id}
                name={invite.data.name}
                id={invite.data.number}
              />
            ))}
          </Box>
        </Box>
      </ScrollView>
    </SafeArea>
  );
});

export default Get100;

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    backgroundColor: "#D92955",
    alignItems: "center",
    justifyContent: "center",
    height: 210,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: theme.spacing.xl,
  },
  cardImage: {
    height: madAppLogo.height,
    width: madAppLogo.width,
  },
  step: {
    flexDirection: "row",
    marginBottom: theme.spacing.xl,
  },
  stepDetails: {
    marginLeft: 7,
    flex: 1,
  },
  stepTitle: {
    fontFamily: "Normal",
    fontSize: 17,
    color: theme.colors.dark,
  },
  stepDescription: {
    fontFamily: "Normal",
    fontSize: 14,
    color: "#939393",
  },
  couponShare: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 30,
    borderRadius: theme.borderRadii.l,
    marginBottom: theme.spacing.l,
  },
  coupon: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: theme.colors.gray,
  },
  couponText: {
    fontFamily: "Bold",
    fontSize: 25,
    color: theme.colors.dark,
  },
  inviteCount: {
    height: 18,
    width: 18,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.m,
    alignItems: "center",
    justifyContent: "center",
  },
}));
