import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Dimensions, Alert, Pressable } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import {
  Box,
  Button,
  HeaderBar,
  Icon,
  SafeArea,
  useTheme,
  Text,
} from "../../components";
import DissmissKeyboard from "../../components/DissmissKeyboard";
import Input from "../../components/Input";
import { useUser } from "../../state/hooks/useUser";

const MyProfile = observer(() => {
  const theme = useTheme();

  const windowWidth = Dimensions.get("window").width;
  const INPUT_GROUP_WIDTH = (windowWidth - theme.spacing.screen * 2) / 2 - 3;

  const { user, updateUser } = useUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState(new Date(1598051730000));
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);

  const onBirthdayChange = (date: any) => {
    setShowBirthdayPicker(false);
    setBirthday(date);
  };

  const handleSave = async () => {
    try {
      if (firstName) await updateUser({ firstName });
      if (lastName) await updateUser({ lastName });
      if (phoneNumber) await updateUser({ phone: phoneNumber });
      if (email) await updateUser({ email });
      Alert.alert("Saved");
    } catch (err) {
      Alert.alert("Something went wrong");
    }
  };

  useEffect(() => {
    if (user) {
      if (user.firstName) setFirstName(user.firstName);
      if (user.lastName) setLastName(user.lastName);
      if (user.email) setEmail(user.email);
      setPhoneNumber(user.phone);
    }
  }, [user]);

  return (
    <SafeArea>
      <DissmissKeyboard>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box
            // stops the touch event propagation
            onStartShouldSetResponder={() => true}
          >
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
                label="First Name"
                value={firstName}
                onChangeText={(value) => setFirstName(value)}
              />

              <Input
                style={{ marginBottom: 20 }}
                label="Last Name"
                value={lastName}
                onChangeText={(value) => setLastName(value)}
              />

              <Input
                style={{ marginBottom: 20 }}
                label="Phone"
                value={phoneNumber}
                onChangeText={(value) => setPhoneNumber(value)}
              />

              {/* TODO: ADD PICKER */}
              <Box flexDirection="row" justifyContent="space-between" mb="xl">
                <Input
                  style={{ width: INPUT_GROUP_WIDTH }}
                  label="Gender"
                  onChangeText={() => null}
                />

                <Box>
                  <Text mb="m" fontFamily="Medium">
                    Birthday
                  </Text>
                  <Pressable onPress={() => setShowBirthdayPicker(true)}>
                    <Box
                      style={{
                        width: INPUT_GROUP_WIDTH,
                        height: 56,
                        borderColor: "#DDDDDD",
                        borderWidth: 1,
                        padding: 16,
                        borderRadius: 12,
                      }}
                    >
                      <Text fontSize={18}>{`${birthday.getDate()}/${
                        birthday.getMonth() + 1 // month is 0-based
                      }/${birthday.getFullYear()}`}</Text>
                    </Box>
                  </Pressable>
                  <DateTimePickerModal
                    isVisible={showBirthdayPicker}
                    mode="date"
                    onConfirm={(date) => onBirthdayChange(date)}
                    onCancel={() => setShowBirthdayPicker(false)}
                  />
                </Box>
              </Box>

              <Input
                style={{ marginBottom: 20 }}
                label="Email"
                value={email}
                onChangeText={(value) => setEmail(value)}
              />

              <Button
                style={{ marginBottom: 50 }}
                onPress={handleSave}
                size="lg"
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </ScrollView>
      </DissmissKeyboard>
    </SafeArea>
  );
});

export default MyProfile;
