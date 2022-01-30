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

export enum LabelEnum {
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

interface LabelProps {
  onLabelChange: (label: LabelEnum | string) => void;
}

const Label = ({ onLabelChange }: LabelProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const navigation = useNavigation();

  const [labels, setLabels] = React.useState<LabelType[]>(defaultLabels);
  const [selected, setSelected] = React.useState<LabelEnum | string>(
    LabelEnum.HOME
  );
  const [newLabelName, setNewLabelName] = React.useState("");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const _handleLabelChange = (name: LabelEnum | string) => {
    setSelected(name);
    onLabelChange(name);
  };

  const _handleLabelAdd = () => {
    const _newLabel: LabelType = {
      name: newLabelName,
      icon: "x",
    };
    setLabels((_labels) => [..._labels, _newLabel]);
    setIsAddModalOpen(false);
  };

  const _handleLabelOther = () => {
    setIsAddModalOpen(true);
  };

  return (
    <Box>
      {/* Add label modal */}
      <CustomModal
        visible={isAddModalOpen}
        title="Add Label"
        buttonTitle="Add"
        onRequestClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onBackPress={() => navigation.goBack()}
        onButtonPress={_handleLabelAdd}
      >
        <Input
          onChangeText={setNewLabelName}
          value={newLabelName}
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

          {labels.length <= 3 && (
            // otherLabel
            <Box style={styles.labelItem}>
              <TouchableWithoutFeedback onPress={_handleLabelOther}>
                <CircularIcon
                  name={otherLabel.icon}
                  size={50}
                  backgroundColor={theme.colors.primaryContrast}
                  color={theme.colors.primary}
                />
              </TouchableWithoutFeedback>
              <Text style={[styles.label, { color: "#a3a3a3" }]}>
                {otherLabel.name}
              </Text>
            </Box>
          )}
        </ScrollView>
      </Box>
    </Box>
  );
};

export default Label;

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
