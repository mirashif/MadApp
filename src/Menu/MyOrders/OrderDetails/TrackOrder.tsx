import React from "react";
import { Pressable } from "react-native";

import { Box, Icon, OrderStageBar, Text, useTheme } from "../../../components";

const TrackOrder = () => {
  const theme = useTheme();

  return (
    <Box style={{ marginHorizontal: 22 }}>
      <Pressable>
        <Box
          style={{
            paddingTop: 20,
            paddingBottom: 17,
            paddingLeft: 23,
            paddingRight: 18,
            borderWidth: 1,
            borderColor: theme.colors.lightGray,
            borderRadius: theme.borderRadii.xl,
          }}
        >
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Text fontFamily="Medium" fontSize={16} color="primary">
                Track Order
              </Text>

              <Box width={131} mt="s">
                <Text
                  fontFamily="Normal"
                  fontSize={11}
                  style={{ color: "#939393" }}
                >
                  Your order is currently being processed.
                </Text>
              </Box>
            </Box>

            <Box flexDirection="row" alignItems="center">
              <Text
                mr="s"
                fontFamily="Normal"
                fontSize={22}
                style={{ color: "#383838" }}
              >
                30-40
              </Text>

              <Text
                fontFamily="Normal"
                fontSize={12}
                style={{ color: "#383838" }}
              >
                MINS
              </Text>
            </Box>

            <Icon name="arrow-right" color={theme.colors.primary} size={24} />
          </Box>

          <Box mt="l">
            <OrderStageBar
              stage={1}
              containerWidth={296}
              activeBarWidth={233}
              inactiveBarWidth={17}
            />
          </Box>
        </Box>
      </Pressable>
    </Box>
  );
};

export default TrackOrder;
