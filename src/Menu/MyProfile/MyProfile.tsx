import React from "react";
import { Image, ScrollView, Dimensions } from "react-native";

import {
  Box,
  Button,
  HeaderBar,
  Icon,
  SafeArea,
  useTheme,
} from "../../components";
import DissmissKeyboard from "../../components/DissmissKeyboard";
import Input from "../../components/Input";

const MyProfile = () => {
  const theme = useTheme();

  const windowWidth = Dimensions.get("window").width;

  const INPUT_GROUP_WIDTH = (windowWidth - theme.spacing.screen * 2) / 2 - 3;

  return (
    <SafeArea>
      <DissmissKeyboard>
        <ScrollView showsVerticalScrollIndicator={false}>
          <HeaderBar title="My Profile" />

          {/* TODO: ADD PICKER */}
          <Box
            alignItems="center"
            style={{ marginVertical: 36 }}
            position="relative"
          >
            <Image
              source={{
                uri: "https://source.unsplash.com/hh3ViD0r0Rc/134x134",
              }}
              style={{ width: 134, height: 134, borderRadius: 134 }}
            />

            <Box
              position="absolute"
              alignItems="center"
              justifyContent="center"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                width: 134,
                height: 134,
                borderRadius: 134,
              }}
            >
              <Icon name="camera" size={46} color="#fff" />
            </Box>
          </Box>

          <Box px="screen">
            <Input
              style={{ marginBottom: 20 }}
              label="Name"
              onChangeText={() => null}
            />

            <Input
              style={{ marginBottom: 20 }}
              label="Phone"
              onChangeText={() => null}
            />

            {/* TODO: ADD PICKER */}
            <Box flexDirection="row" justifyContent="space-between" mb="xl">
              <Input
                style={{ width: INPUT_GROUP_WIDTH }}
                label="Gender"
                onChangeText={() => null}
              />

              <Input
                style={{ width: INPUT_GROUP_WIDTH }}
                label="Birthday"
                onChangeText={() => null}
              />
            </Box>

            <Input
              style={{ marginBottom: 20 }}
              label="Email"
              onChangeText={() => null}
            />

            <Button style={{ marginBottom: 50 }} onPress={() => null} size="lg">
              Save Changes
            </Button>
          </Box>
        </ScrollView>
      </DissmissKeyboard>
    </SafeArea>
  );
};

export default MyProfile;
