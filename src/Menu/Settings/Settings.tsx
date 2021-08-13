import React, { useState } from "react";
import { ScrollView } from "react-native";

import { HeaderBar, SafeArea } from "../../components";

import SwitchItem from "./SwitchItem";

const Settings = () => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);

  return (
    <SafeArea>
      <ScrollView>
        <HeaderBar title="Settings" />

        <SwitchItem
          title="Receive Push Notifications"
          value={isNotificationEnabled}
          onValueChange={() => setIsNotificationEnabled(!isNotificationEnabled)}
        />

        <SwitchItem
          title="Receive Offers by Email"
          value={isEmailEnabled}
          onValueChange={() => setIsEmailEnabled(!isEmailEnabled)}
        />
      </ScrollView>
    </SafeArea>
  );
};

export default Settings;
