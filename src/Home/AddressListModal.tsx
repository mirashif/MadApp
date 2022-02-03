import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  FadingTransition,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Theme } from "../components";
import { Box, Icon, makeStyles, Text, useTheme } from "../components";

const addresses = ["Home", "Work"];

interface Props {
  onClose: () => void;
}

const AddressListModal = ({ onClose }: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [selected, setSelected] = React.useState(0);

  return (
    <Animated.View layout={FadingTransition} style={styles.backdrop}>
      <Animated.View
        entering={SlideInUp}
        exiting={SlideOutUp}
        style={styles.container}
      >
        <Box style={[styles.header, { paddingTop: insets.top }]}>
          <Pressable onPress={onClose}>
            <Icon name="arrow-left" size={24} />
          </Pressable>
          <Text ml="m" fontSize={24}>
            Delivery address
          </Text>
        </Box>

        {/* Saved locations */}
        {addresses.map((address, idx) => {
          const isSelected = selected === idx;
          return (
            <Box key={idx} style={styles.item}>
              <Pressable
                onPress={() => undefined}
                style={styles.radioContainer}
              >
                <Box
                  style={[
                    styles.radio,
                    isSelected ? styles.radioSelected : undefined,
                  ]}
                />
              </Pressable>

              <Box style={styles.address}>
                <Text style={styles.label}>{address}</Text>
                <Text
                  style={styles.street}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  123 Main St, New York
                </Text>
              </Box>

              <Pressable onPress={undefined} style={styles.editIcon}>
                <Icon name="edit-2" size={13} color={theme.colors.primary} />
              </Pressable>
            </Box>
          );
        })}

        {/* Current location */}
        <Box style={styles.item}>
          <Pressable onPress={() => undefined} style={styles.radioContainer}>
            <Icon name="map-pin" size={18} color={theme.colors.primary} />
          </Pressable>

          <Box style={styles.address}>
            <Text style={styles.label}>Use Current Location</Text>
            <Text style={styles.street} numberOfLines={1} ellipsizeMode="tail">
              123 Main St, New York
            </Text>
          </Box>

          <Pressable onPress={undefined} style={styles.editIcon}>
            <Icon name="edit-2" size={13} color={theme.colors.primary} />
          </Pressable>
        </Box>

        {/* Add new address */}
        <Pressable onPress={() => undefined} style={styles.addAddress}>
          <Icon name="plus" size={23} color={theme.colors.primary} />
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.primary,
              marginLeft: 12,
            }}
          >
            Add a New Address
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

export default AddressListModal;

const useStyles = makeStyles((theme: Theme) => ({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  container: {
    backgroundColor: "white",
    paddingVertical: 25,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 25,
    marginBottom: 25,
  },
  item: {
    flexDirection: "row",
    marginHorizontal: 30,
    marginBottom: 30,
  },
  radioContainer: {
    paddingTop: 5,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 18,
    borderWidth: 4,
    borderColor: theme.colors.primary,
  },
  radioSelected: {
    backgroundColor: theme.colors.primary,
  },
  address: {
    marginLeft: 15,
    marginRight: 30,
    flexShrink: 1,
    flexGrow: 1,
  },
  label: {
    fontSize: 18,
    color: "#111",
    marginBottom: 5,
  },
  street: {
    fontSize: 14,
    color: "#838383",
  },
  editIcon: {
    height: 13,
    width: 13,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  addAddress: {
    marginHorizontal: 27,
    flexDirection: "row",
    alignItems: "center",
  },
}));
