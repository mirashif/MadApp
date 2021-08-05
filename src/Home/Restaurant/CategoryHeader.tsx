import React from "react";
import { ScrollView } from "react-native";

import { Box, Text, useTheme } from "../../components";

const categories = ["Potato Mehedi", "Tomato Soups", "Gourmet Pizzas"];

const CategoryHeader = () => {
  const theme = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Box style={{ flexDirection: "row" }}>
        {categories.map((c, i) => (
          <Text
            key={i}
            style={{
              fontFamily: "Bold",
              fontSize: 18,
              color: theme.colors.foreground,
            }}
          >
            - {c}
          </Text>
        ))}
      </Box>
    </ScrollView>
  );
};

export default CategoryHeader;
