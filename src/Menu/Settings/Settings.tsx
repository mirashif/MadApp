import { observer } from "mobx-react";
import React from "react";
import { ScrollView } from "react-native";

import { HeaderBar, SafeArea } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { SettingsType, UserStore } from "../../state/store/UserStore";

import SwitchItem from "./SwitchItem";

const Settings = () => {
  const user: UserStore = useAppState("user");
  const settings: SettingsType = user.settings;
  const receivePush = settings.receivePush;
  const receiveEmail = settings.receiveEmail;

  return (
    <SafeArea>
      <ScrollView>
        <HeaderBar title="Settings" />
        <SwitchItem
          title="Receive Push Notifications"
          value={receivePush ?? false}
          onValueChange={async () =>
            await user.updateSettings({
              ...settings,
              receivePush: !receivePush,
            })
          }
        />
        <SwitchItem
          title="Receive Offers by Email"
          value={receiveEmail ?? false}
          onValueChange={async () =>
            await user.updateSettings({
              ...settings,
              receiveEmail: !receiveEmail,
            })
          }
        />
      </ScrollView>
    </SafeArea>
  );
};

export default observer(Settings);
