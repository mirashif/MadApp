import React from "react";

import type { Theme } from "../components";
import { Box, makeStyles, Text } from "../components";

interface InviteItemProps {
  name: string;
  id: string;
}

const InviteItem = ({ name, id }: InviteItemProps) => {
  const styles = useStyles();

  return (
    <Box style={styles.inviteItem}>
      <Box style={styles.inviteDecorator} />
      <Box>
        <Text style={styles.inviteName}>{name}</Text>
        <Text style={styles.inviteId}>{id}</Text>
      </Box>
    </Box>
  );
};

export default InviteItem;

const useStyles = makeStyles((theme: Theme) => ({
  inviteItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.s,
  },
  inviteDecorator: {
    height: 15,
    width: 15,
    borderRadius: 15,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.m,
    alignItems: "center",
    justifyContent: "center",
  },
  inviteName: {
    fontFamily: "Normal",
    fontSize: 14,
    color: theme.colors.foreground,
  },
  inviteId: {
    fontFamily: "Normal",
    fontSize: 11,
    color: theme.colors.gray,
  },
}));
