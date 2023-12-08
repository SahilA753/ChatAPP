import React from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [cnfShow, setCnfShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const toast = useToast();
  const postDetails = (pics) => {
    setLoading(true);
    console.log(pics);
    if (pics === undefined) {
      toast({
        title: "Please Select An Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "daspplhqg");
      fetch("https://api.cloudinary.com/v1_1/daspplhqg/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select An Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const submitHandler = async () => {
    if (!name || !password || !confirmPass || !email) {
      toast({
        title: "Please Fill All Details",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPass) {
      toast({
        title: "Password & Confirm Password don't match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/",
        { name, email, password, pic },
        config
      );
      console.log(data);
      toast({
        title: "Registered Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (err) {
      toast({
        title: "Error Occured",
        status: "warning",
        description: err.response.data.message,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <VStack spacing="10px">
      <FormControl id="first-name" isRequired style={{ marginBottom: "5px" }} color = "white">
        <FormLabel>NAME</FormLabel>
        <Input
          type="text"
          placeholder="Enter Name"
          onChange={(ev) => {
            setName(ev.target.value);
          }}
          value={name}
          _placeholder={{
            color: 'rgba(255, 255, 255, 0.5)', // Dull white color
          }}
          _value={{
            color: 'rgba(255, 255, 255, 0.5)', // Dull white color
          }}
          _focus={{
            borderColor: 'rgba(255, 255, 255, 0.5)', // Dull white color
            boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.5)', // Dull white color
          }}
        />
      </FormControl>
      <FormControl style={{ marginBottom: "5px" }} id="email" isRequired color = "white">
        <FormLabel>EMAIL</FormLabel>
        <Input
          type="email"
          placeholder="Enter Email"
          onChange={(ev) => {
            setEmail(ev.target.value);
          }}
          value={email}
          _placeholder={{
            color: 'rgba(255, 255, 255, 0.5)', // Dull white color
          }}
          _value={{
            color: 'rgba(255, 255, 255, 0.5)', // Dull white color
          }}
          _focus={{
            borderColor: 'rgba(255, 255, 255, 0.5)', // Dull white color
            boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.5)', // Dull white color
          }}
        />
      </FormControl>
      <FormControl style={{ marginBottom: "5px" }} id="password" isRequired color = "white">
        <FormLabel>PASSWORD</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(ev) => {
              setPassword(ev.target.value);
            }}
            value={password}
            _placeholder={{
              color: 'rgba(255, 255, 255, 0.5)', // Dull white color
            }}
            _value={{
              color: 'rgba(255, 255, 255, 0.5)', // Dull white color
            }}
            _focus={{
              borderColor: 'rgba(255, 255, 255, 0.5)', // Dull white color
              boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.5)', // Dull white color
            }}
          />
          <Button
            h="1.75rem"
            size="sm"
            bgColor={"white"}
            m={"1"}
            onClick={() => {
              setShow(!show);
            }}
          >
            {show ? "Hide" : "Show"}
          </Button>
        </InputGroup>
      </FormControl>
      <FormControl style={{ marginBottom: "5px" }} id="cnfpassword" isRequired color = "white">
        <FormLabel>CONFIRM PASSWORD</FormLabel>
        <InputGroup>
          <Input
            type={cnfShow ? "text" : "password"}
            placeholder="Re-Enter Password"
            onChange={(ev) => {
              setConfirmPass(ev.target.value);
            }}
            value={confirmPass}
            _placeholder={{
              color: 'rgba(255, 255, 255, 0.5)', // Dull white color
            }}
            _value={{
              color: 'rgba(255, 255, 255, 0.5)', // Dull white color
            }}
            _focus={{
              borderColor: 'rgba(255, 255, 255, 0.5)', // Dull white color
              boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.5)', // Dull white color
            }}
          />
          <Button
            h="1.75rem"
            size="sm"
            bgColor={"white"}
            m={"1"}
            onClick={() => {
              setCnfShow(!cnfShow);
            }}
          >
            {cnfShow ? "Hide" : "Show"}
          </Button>
        </InputGroup>
      </FormControl>
      <FormControl style={{ marginBottom: "5px" }} id="pic" color = "white">
        <FormLabel>PROFILE PIC</FormLabel>
        <Input
          type="file"
          accept="image/*"
          p={1}
          placeholder="Enter Name"
          onChange={(ev) => {
            postDetails(ev.target.files[0]);
          }}
          _placeholder={{
            color: 'rgba(255, 255, 255, 0.5)', // Dull white color
          }}
          _value={{
            color: 'rgba(255, 255, 255, 0.5)', // Dull white color
          }}
          _focus={{
            borderColor: 'rgba(255, 255, 255, 0.5)', // Dull white color
            boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.5)', // Dull white color
          }}
        />
      </FormControl>
      <Button
         colorScheme="black"
         backgroundColor="rgba(0, 0, 0, 0.5)"  // Black with 50% transparency
         borderColor="#ffffff"
         width="100%"
         onClick={submitHandler}
         style={{ marginTop: "15px" }}
         isLoading={loading}
      >
        SIGN UP
      </Button>
    </VStack>
  );
};

export default SignUp;
