import React, { useEffect } from "react";

import { ChatState } from "../Context/ChatProvider";
import { DarkMode, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import { Text, Image } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
// import Chat from "../../../backend/models/chatModel";
import ChatLoading from "./ChatLoading";
import { Stack } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import ChatImage from "./ChatImage";
const MyChats = ({ fetchAgain }) => {
  const [loggeduser, setLoggeduser] = useState();
  const {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    darkMode,
  } = ChatState();
  const toast = useToast();
  // useEffect(() => {
  // }, []);
  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      console.log(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggeduser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
     <Box
  pb={3}
  px={3}
  fontSize={{ base: "20px", md: "25px" }}
  fontFamily="Work sans"
  display="flex"
  bg={darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
  borderRadius="lg"
  color={darkMode ? "black" : "white"}
  w="100%"
  justifyContent="space-between"
  alignItems="center"
  marginBottom="5px"
>
  <Box flex="1">My Chats</Box>
  <GroupChatModal>
    <Button
      d="flex"
      fontSize={{ base: "17px", md: "10px", lg: "17px" }}
      rightIcon={<AddIcon />}
      alignSelf="flex-start" // Align the button to the start of the flex container
    >
      New Group
    </Button>
  </GroupChatModal>
</Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg={DarkMode ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)"}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats &&
              chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "transparent"}
                  color={
                    selectedChat === chat
                      ? "white"
                      : DarkMode
                      ? "white"
                      : "black"
                  }
                  _hover={{
                    bg: "#E8E8E8",
                    color: DarkMode ? "black" : "white",
                  }}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                  display="flex"
                  height="70px"
                >
                  <>
                    {!chat.isGroupChat ? (
                      <ChatImage user={getSenderFull(loggeduser, chat.users)} />
                    ) : (
                      <Image
                        borderRadius="full"
                        boxSize="50px"
                        src={chat.profilePic}
                        alt={user.name}
                      />
                    )}
                  </>
                  <Box marginLeft="5px">
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(loggeduser, chat.users)
                        : chat.chatName}
                    </Text>

                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        <b>{chat.latestMessage.sender.name} : </b>
                        {chat.latestMessage.content &&
                        chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </Box>
                </Box>
              ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
