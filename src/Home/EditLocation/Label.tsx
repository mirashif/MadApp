import type { Feather } from "@expo/vector-icons";
import React from "react";

import {
  Box,
  CircularIcon,
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

const LABELS: {
  name: LabelEnum;
  icon: React.ComponentProps<typeof Feather>["name"];
}[] = [
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
  {
    name: LabelEnum.OTHER,
    icon: "plus",
  },
];

const Label = () => {
  const styles = useStyles();
  const theme = useTheme();

  const [selected, setSelected] = React.useState<LabelEnum>(LabelEnum.HOME);

  return (
    <Box>
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
        {LABELS.map(({ name, icon }, idx) => {
          const isSelected = selected === name;
          return (
            <Box key={idx} style={styles.labelItem}>
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
              <Text
                style={[
                  styles.label,
                  { color: isSelected ? "#a3a3a3" : "#3d3d3d" },
                ]}
              >
                {name}
              </Text>
            </Box>
          );
        })}
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
  },
  label: {
    marginTop: 6,
  },
}));
