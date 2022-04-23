import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Dimensions, Alert, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
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

const IMAGE_SIZE = 134;

const MyProfile = observer(() => {
  const theme = useTheme();

  const windowWidth = Dimensions.get("window").width;
  const INPUT_GROUP_WIDTH = (windowWidth - theme.spacing.screen * 2) / 2 - 3;

  const { user, updateUser } = useUser();

  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState(null);
  const [birthday, setBirthday] = useState(new Date(1598051730000));
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const onBirthdayChange = (date: any) => {
    setBirthday(date);
    setShowBirthdayPicker(false);
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

            <Box
              style={{
                marginVertical: 36,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pressable
                onPress={pickImage}
                style={{
                  position: "relative",
                  height: IMAGE_SIZE,
                  width: IMAGE_SIZE,
                  borderRadius: IMAGE_SIZE,
                  overflow: "hidden",
                }}
              >
                {image && (
                  <Image
                    source={{
                      uri: image,
                    }}
                    style={{
                      position: "absolute",
                      width: IMAGE_SIZE,
                      height: IMAGE_SIZE,
                      borderRadius: IMAGE_SIZE,
                    }}
                  />
                )}
                <Box
                  style={{
                    position: "absolute",
                    width: IMAGE_SIZE,
                    height: IMAGE_SIZE,
                    borderRadius: IMAGE_SIZE,
                    // for icon
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <Icon name="camera" size={46} color="#fff" />
                </Box>
              </Pressable>
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
                inputProps={{
                  editable: false,
                }}
              />

              <Box flexDirection="row" justifyContent="space-between" mb="xl">
                <Box>
                  <Text mb="m" fontFamily="Medium">
                    Gender
                  </Text>

                  <Box
                    style={{
                      width: INPUT_GROUP_WIDTH,
                      height: 56,
                      borderColor: "#DDDDDD",
                      borderWidth: 1,
                      paddingVertical: 16,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <RNPickerSelect
                      value={gender}
                      onValueChange={(v) => setGender(v)}
                      fixAndroidTouchableBug={true}
                      placeholder={{
                        label: "Select gender",
                        value: null,
                      }}
                      items={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                      ]}
                      style={{
                        placeholder: {
                          fontSize: 18,
                          color: "#dddddd",
                        },
                        inputAndroid: {
                          fontSize: 18,
                          color: "black",
                        },
                        inputIOS: {
                          fontSize: 18,
                          color: "black",
                        },
                      }}
                    />
                  </Box>
                </Box>

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
