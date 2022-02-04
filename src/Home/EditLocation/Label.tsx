import React, { useEffect } from "react";
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
  HOME = "home",
  WORK = "work",
  PARTNER = "partner",
  OTHER = "other",
}

const getIconName = (label: string) => {
  switch (label.toLowerCase()) {
    case LabelEnum.HOME:
      return "home";
    case LabelEnum.WORK:
      return "briefcase";
    case LabelEnum.PARTNER:
      return "heart";
    case LabelEnum.OTHER:
      return "plus";
    default:
      return "x";
  }
};

const defaultLabels: string[] = [
  LabelEnum.HOME,
  LabelEnum.WORK,
  LabelEnum.PARTNER,
];

interface LabelProps {
  label: string | null;
  onChange: (label: string) => void;
}

const Label = ({ label, onChange }: LabelProps) => {
  const styles = useStyles();
  const theme = useTheme();

  const [labels, setLabels] = React.useState(defaultLabels);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const [newLabel, setNewLabel] = React.useState("");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const _setUniqueLabels = (_label: string) => {
    const uniqueLabels = [...new Set([...labels, _label.toLowerCase()])];
    setLabels(uniqueLabels);
  };

  const _handleChangeLabel = (idx: number, _label: string) => {
    setActiveIndex(idx);
    onChange(_label);
  };

  const _handleAddNewLabel = () => {
    _setUniqueLabels(newLabel);
    setIsAddModalOpen(false);
  };

  useEffect(() => {
    if (!label) return;
    _setUniqueLabels(label);
    const _activeIndex = labels.findIndex((l) => l === label.toLowerCase());
    setActiveIndex(_activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      style={{
        marginBottom: 36,
      }}
    >
      {/* Add label modal */}
      <CustomModal
        visible={isAddModalOpen}
        title="Add Label"
        buttonTitle="Add"
        onRequestClose={() => undefined}
        onBackPress={() => setIsAddModalOpen(false)}
        onButtonPress={_handleAddNewLabel}
      >
        <Input
          onChangeText={setNewLabel}
          value={newLabel}
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
          {labels.map((_label, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <Box key={idx} style={styles.labelItem}>
                <TouchableWithoutFeedback
                  onPress={() => _handleChangeLabel(idx, _label)}
                >
                  <CircularIcon
                    name={getIconName(_label)}
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
                  {_label}
                </Text>
              </Box>
            );
          })}

          <Box style={styles.labelItem}>
            <TouchableWithoutFeedback onPress={() => setIsAddModalOpen(true)}>
              <CircularIcon
                name="plus"
                size={50}
                backgroundColor={theme.colors.primaryContrast}
                color={theme.colors.primary}
              />
            </TouchableWithoutFeedback>
            <Text style={[styles.label, { color: "#a3a3a3" }]}>
              {LabelEnum.OTHER}
            </Text>
          </Box>
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
    textTransform: "capitalize",
  },
}));
