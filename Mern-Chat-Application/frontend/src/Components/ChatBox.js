import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, darkMode } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="right"
      flexDir="column"
      p={3}
      bg={darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
      w={{ base: "100%", md: "68%" }}
      borderRadius="2g"
      borderWidth="2px"
      color="white"  // Set the text color to white
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
