import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import { Box } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const ChatPage = () => {
  const { user, darkMode } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        style={{
          display: "flex",
          justifyContent: "space-around", // Adjusted the space to around
          width: "100%",
          height: "91.5vh",
          padding: "10px",
          // backgroundColor: darkMode ? "#272626" : "#fff", // Adjusted background color based on dark mode
          color: darkMode ? "#fff" : "#000", // Adjusted text color based on dark mode
        }}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
