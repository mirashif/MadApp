import type { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import {
  Box,
  CircularIcon,
  CustomModal,
  Input,
  makeStyles,
  Text,
  useTheme,
} from "../../components";

enum LabelEnum {
  HOME = "Home",
  WORK = "Work",
  PARTNER = "Partner",
  OTHER = "Other",
}

interface LabelType {
  name: LabelEnum | string;
  icon: React.ComponentProps<typeof Feather>["name"];
}

const defaultLabels: LabelType[] = [
  {
    name: LabelEnum.HOME,
    icon: "home",
  },
  {
    name: LabelEnum.WORK,
    icon: "briefcase",
  },
  {
    name: LabelEnum.PARTNER,
    icon: "heart",
  },
];

const otherLabel: LabelType = {
  name: LabelEnum.OTHER,
  icon: "plus",
};

const Label = () => {
  const styles = useStyles();
  const theme = useTheme();
  const navigation = useNavigation();

  const [labels, setLabels] = React.useState(defaultLabels);
  const [selected, setSelected] = React.useState<LabelEnum | string>(
    LabelEnum.HOME
  );
  const [newLabelName, setNewLabelName] = React.useState("");

  const _handleLabelChange = (name: LabelEnum | string) => {
    setSelected(name);
  };

  const _handleLabelAdd = () => {
    const _newLabel = {
      name: newLabelName,
      icon: "x",
    };
  };

  return (
    <Box>
      <CustomModal
        visible={true}
        title="Add Label"
        buttonTitle="Add"
        onRequestClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onBackPress={() => navigation.goBack()}
        onButtonPress={_handleLabelAdd}
      >
        <Input
          onChangeText={(v) => setNewLabelName(v)}
          style={{
            marginVertical: 16,
          }}
        />
      </CustomModal>

      <Text
        style={{
          fontFamily: "Bold",
          fontSize: 14,
          marginBottom: 25,
        }}
      >
        Add a label
      </Text>

      <Box style={styles.labels}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {labels.map(({ name, icon }, idx) => {
            const isSelected = selected === name;
            return (
              <Box key={idx} style={styles.labelItem}>
                <TouchableWithoutFeedback
                  onPress={() => _handleLabelChange(name)}
                >
                  <CircularIcon
                    name={icon}
                    size={50}
                    backgroundColor={
                      isSelected
                        ? theme.colors.primary
                        : theme.colors.primaryContrast
                    }
                    color={
                      isSelected
                        ? theme.colors.primaryContrast
                        : theme.colors.primary
                    }
                  />
                </TouchableWithoutFeedback>
                <Text
                  style={[
                    styles.label,
                    { color: isSelected ? "#3d3d3d" : "#a3a3a3" },
                  ]}
                >
                  {name}
                </Text>
              </Box>
            );
          })}
        </ScrollView>
      </Box>
    </Box>
  );
};

export default Label;

const OtherLabel = () => {
  const styles = useStyles();

  return (
    <Box style={styles.labelItem}>
      <TouchableWithoutFeedback onPress={() => _handleLabelChange(name)}>
        <CircularIcon
          name={icon}
          size={50}
          backgroundColor={
            isSelected ? theme.colors.primary : theme.colors.primaryContrast
          }
          color={
            isSelected ? theme.colors.primaryContrast : theme.colors.primary
          }
        />
      </TouchableWithoutFeedback>
      <Text
        style={[styles.label, { color: isSelected ? "#3d3d3d" : "#a3a3a3" }]}
      >
        {name}
      </Text>
    </Box>
  );
};

const useStyles = makeStyles(() => ({
  labels: {
    flexDirection: "row",
  },
  labelItem: {
    alignItems: "center",
    fontSize: 14,
    fontFamily: "Normal",
    marginRight: 25,
  },
  label: {
    marginTop: 6,
  },
}));
