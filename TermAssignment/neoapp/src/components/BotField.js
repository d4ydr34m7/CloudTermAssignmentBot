import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import AndroidIcon from "@mui/icons-material/Android";
import Linkify from "react-linkify";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const BotField = () => {
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const userIdGen = uuidv4();

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const response = await fetch(
      "https://2gpf9pl5vf.execute-api.us-east-1.amazonaws.com/test/senddata",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          botName: "myBot",
          botAlias: "BotAlias",
          userId: userIdGen,
          inputText: userInput,
        }),
      }
    );

    const data = await response.json();
    const botResponse = data.dialogAction.message.content;

    setChatMessages([
      ...chatMessages,
      { sender: "user", message: userInput },
      { sender: "bot", message: botResponse },
    ]);
    setUserInput("");
  };

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const componentDecorator = (href, text, key) => {
    if (href.startsWith("http")) {
      return (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      );
    } else {
      return text;
    }
  };

  //https://github.com/tasti/react-linkify
  const parseMessage = (msg) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = msg.match(urlRegex);
    if (match !== null) {
      const url = match[0];
      const parts = msg.split(urlRegex);
      return parts.map((part, index) => {
        if (part === url) {
          return (
            <Linkify componentDecorator={componentDecorator} key={index}>
              {url}
            </Linkify>
          );
        } else {
          return part;
        }
      });
    } else {
      return msg;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          top: 270,
          left: 100,
          m: 2,
        }}
      >
        <AndroidIcon sx={{ fontSize: 48 }} />
        <Typography variant="h6" sx={{ ml: 1, fontSize: 14 }}>
          Hi<br></br> How may I help?
        </Typography>
      </Box>
      <Grid container spacing={2} direction="column" maxWidth="md">
        <Grid item>
          <Box
            sx={{
              maxHeight: "60vh",
              overflowY: "auto",
              border: "1px solid rgba(0, 0, 0, 0.12)",
              borderRadius: 2,
              p: 2,
              bgcolor: "background.paper",
            }}
          >
            {chatMessages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  mb: 2,
                }}
              >
                {/* https://blog.logrocket.com/how-to-build-chatroom-app-react-firebase/ */}
                <Typography
                  variant="body1"
                  sx={{
                    display: "inline-block",
                    maxWidth: "80%",
                    borderRadius: 1,
                    p: 1,
                    wordWrap: "break-word",
                    bgcolor: msg.sender === "user" ? "blue" : "gray",
                    color: "common.white",
                  }}
                >
                  {parseMessage(msg.message)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  label="Type your message"
                  value={userInput}
                  onChange={handleUserInputChange}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BotField;
