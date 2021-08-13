import React from "react";

import { Box } from "../../components";

interface ItemProps {
  children: React.ReactNode;
}

const Item = ({ children }: ItemProps) => {
  return (
    <Box
      height={50}
      style={{ paddingHorizontal: 28 }}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      {children}
    </Box>
  );
};

export default Item;
