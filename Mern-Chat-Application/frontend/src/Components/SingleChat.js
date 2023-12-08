import React from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Spinner,
  Input,
  Indicator,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { ArrowBackIcon, AtSignIcon, CheckCircleIcon, DownloadIcon, RepeatClockIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import Lottie from "lottie-react";
import animationData from "../animation/typing.json";
import DownloadChat from "./DownloadChat";
import { Tooltip } from "@chakra-ui/tooltip";
import HandleAttachment from "./miscellaneous/HandleAttachment";
import { Spacer } from "@chakra-ui/react";

import { SmileyIcon } from "@chakra-ui/icons"; // Import the emoji icon of your choice
// import { AiTwotoneVideoCamera } from "@react-icons/fa";
// import { IconButton } from "@chakra-ui/react";
import { TimeIcon, ChatIcon, PhoneIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import ScheduleMessage from "./ScheduleMessage";
import { Flex } from "@chakra-ui/react";



const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  // const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const history = useHistory();
  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    darkMode,
  } = ChatState();
  const handleEmojiClick = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
    setShowEmojiPicker(false);
  };

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnnected, setSocketConnnected] = useState(false);
  const [disappearingChat, setDisappearingChat] = useState(false);
  // const [msglen, setMsglen] = useState(0);
  // const [notification, setNotification] = useState([]);
  const toast = useToast();
  const ENDPOINT = "http://localhost:5000/";
  var socket, selectedChatCompare;
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // socket = io(ENDPOINT);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  // setTimeout(() => {
  //   fetchMessages();
  // }, 1);
  useEffect(() => {
    socket = io(ENDPOINT, {
      reconnectionDelayMax: 10000,
    });
    socket.emit("setup", user);
    // console.log("connected to socket.io");
    socket.on("connect", () => {
      setSocketConnnected(true);
      // console.log("trying to connect");
      // console.log(socket);
    });

    // console.log(socket);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  });
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    // console.log("new useEffect", socket);
    if (socket) {
      socket.on("message recieved", (newMessageRecieved) => {
        // console.log(newMessageRecieved);
        // if chat is not selected or doesn't match current chat
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessageRecieved.chat._id
        ) {
          if (!notification.includes(newMessageRecieved)) {
            setNotification([newMessageRecieved, ...notification]);
            setFetchAgain(!fetchAgain);
            // console.log(notification, "-------------------");
          }
        } else {
          setMessages([...messages, newMessageRecieved]);
        }
        // console.log(messages);
      });
    }
  }, []);

  const submitMessage = async (event) => {
    if (event.key === "Enter" && newMessage !== "") {
      {
        socket && socket.emit("stop typing", selectedChat._id);
      }
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
            disappearMode: disappearingChat,
          },
          config
        );
        // console.log("socket is ", socket);
        {
          socket && socket.emit("new message", data);
        }
        setNewMessage("");
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      // console.log(messages);
      {
        socket && socket.emit("join chat", selectedChat._id);
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to fetch the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnnected) return;
    if (!typing) {
      setTyping(true);
      {
        socket && socket.emit("typing", selectedChat._id);
      }
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        {
          socket && socket.emit("stop typing", selectedChat._id);
        }
        setTyping(false);
      }
    });
  };
  return (
    <>
      {selectedChat ? (
        <>
<Text
  fontSize={{ base: "28px", md: "30px" }}
  pb={3}
  px={2}
  w="100%"
  color={darkMode ? "black" : "white"}
  fontFamily="Work sans"
  display="flex"
  justifyContent="space-between"
  alignItems="center"
>
  <Box>
    {!selectedChat.isGroupChat ? (
      <>
        {getSender(user, selectedChat.users)[0].toUpperCase() +
          getSender(user, selectedChat.users).slice(1)}
        <ProfileModal user={getSenderFull(user, selectedChat.users)} />
      </>
    ) : (
      <>
        {selectedChat.chatName[0].toUpperCase() +
          selectedChat.chatName.slice(1)}
        <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
          <UpdateGroupChatModal
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            fetchMessages={fetchMessages}
          />
        </Tooltip>
      </>
    )}
  </Box>
  <Box display="flex" alignItems="center">
    <DownloadChat />
    <Box ml={2} mr={2}> {/* Adjust the margin value based on your preference */}
      <Tooltip label="Click for video calling" hasArrow placement="bottom-end">
        <a href="http://localhost:3000/videochat" target="_blank">
          <IconButton icon={<PhoneIcon />} />
        </a>
      </Tooltip>
    </Box>
    <Box ml={2} mr={2}> {/* Adjust the margin value based on your preference */}
      <ScheduleMessage />
    </Box>
    {selectedChat.isGroupChat && (
      <Box ml={2} mr={2}> {/* Adjust the margin value based on your preference */}
        <IconButton icon={<RepeatClockIcon />} />
      </Box>
    )}
  </Box>
</Text>


          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg={darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* Messages will come here */}
            {loading ? (
              <Spinner
                alignSelf="center"
                margin="auto"
                size="xl"
                w={20}
                h={20}
              />
            ) : (
              <div className="messages">
                <ScrollableChat
                  messages={messages}
                  disappearingChat={disappearingChat}
                  setMessages={setMessages}

                  // -------------------------------------------------------------------------------
                />
              </div>
            )}
            
            <FormControl
              onKeyDown={submitMessage}
              isRequired
              mt={3}
              display="flex"
            >
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <div></div>
              )}
              <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
    >
      <IconButton
        icon={<CheckCircleIcon/>}
        onClick={() => setShowEmojiPicker((prev) => !prev)}
      />
      {showEmojiPicker && (
        <div>
          
          <button onClick={() => handleEmojiClick("😀")}>😀</button>
          <button onClick={() => handleEmojiClick("😊")}>😊</button>
        
        </div>
      )}
      <FormControl
        onKeyDown={submitMessage}
        isRequired
        mt={3}
        display="flex"
        flex="1"
      >
       
      </FormControl>
    </Box>
              <Input
                variant="filled"
                bg={darkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.7)"}
                placeholder="Type a Message"
                value={newMessage}
                onChange={typingHandler}
              />
              <Tooltip
                label={
                  !disappearingChat
                    ? "Enable Disappearing Chats"
                    : "Enable Normal Chats"
                }
                hasArrow
                placement="bottom-end"
              >
                <IconButton
                  display={{ base: "flex" }}
                  onClick={() => {
                    setDisappearingChat(!disappearingChat);
                  }}
                  icon={!disappearingChat ? <TimeIcon /> : <ChatIcon />}
                />
              </Tooltip>
              <Tooltip label="Send Attachments">
                <HandleAttachment user={user} />
              </Tooltip>
              
            </FormControl>
            
          </Box>
          
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          fontWeight={600}
        >
          <Text
            fontSize="3xl"
            pb={3}
            fontFamily="Work sans"
            color={darkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.7)"}
          >
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
