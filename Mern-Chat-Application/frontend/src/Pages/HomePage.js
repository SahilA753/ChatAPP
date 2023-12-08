import React from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import SignUp from "../Components/Authentication/SignUp";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import AudioRecorder from "../Components/miscellaneous/AudioRecorder";
import { makeStyles } from "@material-ui/core/styles";
import VideoChat from "../Components/VideoChat";

const useStyles = makeStyles((theme) => ({}));

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      history.push("/chat");
    }
  }, [history]);

  return (
    <Container maxWidth="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="rgba(0, 0, 0, 0.5)"
        w="150%"
        m="60px 0 15px 0"
        borderRadius="5g"
        borderWidth="4px"
        borderColor='#d3d3d3'
        textAlign={"center"}
      >
        <Text fontSize="4xl" fontFamily="WorkSans-Bold"  color="white" fontWeight="semi-bold">
          MATE-MAIL
        </Text>
      </Box>
      <Box
        bg="rgba(0, 0, 0, 0.5)"
        w="150%"
        p={4}
        borderRadius="1g"
        borderWidth="4px"
      >
        <Tabs variant="soft-rounded" style={{ borderColor: 'rgba(0, 0, 0, 0.5)' }}>
  <TabList mb="1em">
    <Tab width={"80%"} color='rgba(255, 255, 255, 0.8)'>LOGIN</Tab>
    <Tab width="80%" color='rgba(255, 255, 255, 0.8)'>SIGN UP</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login />
    </TabPanel>
    <TabPanel>
      <SignUp />
    </TabPanel>
  </TabPanels>
</Tabs>

        {/* <AudioRecorder /> */}
      </Box>
    </Container>
  );
};

export default HomePage;
