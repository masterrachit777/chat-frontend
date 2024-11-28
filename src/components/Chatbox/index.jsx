import { useEffect, useState } from "react";
import styled from "styled-components";
import { GlobalSocketSet, SOCKET } from "../../utils/util";
import { storage } from "../../utils/storage";
import axios from "axios";

const ChatboxContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  font-family: "Arial", sans-serif;
`;

const ChatboxWrapper = styled.div`
  width: 40%;
  height: 85vh;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  font-family: 'Arial', sans-serif;

  @media (max-width: 1024px) {
    width: 60%; /* Adjust width for tablets */
    height: 85vh; /* Adjust height for tablets */
  }

  @media (max-width: 768px) {
    width: 80%; /* Adjust width for small tablets or large phones */
    height: 85vh; 
  }

  @media (max-width: 480px) {
    width: 95%; /* Almost full width for mobile devices */
    height: 85vh; 
  }
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  padding: 15px 20px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-radius: 10px 10px 0 0;

  @media (max-width: 768px) {
    font-size: 16px; /* Slightly smaller font for tablets */
    padding: 10px 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px; /* Even smaller font for mobile */
    padding: 8px 12px;
  }
`;

const LogoutButton = styled.button`
  background: #ff5c5c;
  color: #fff;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #e84141;
  }

  @media (max-width: 768px) {
    padding: 6px 12px; /* Adjust padding for tablets */
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 5px 10px; /* Adjust padding for mobile */
    font-size: 10px;
  }
`;

const ChatMessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f9f9f9;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;

  @media (max-width: 768px) {
    padding: 15px; /* Reduce padding for smaller screens */
  }

  @media (max-width: 480px) {
    padding: 10px; /* Further reduce padding for mobile */
  }
`;

const Message = styled.div`
  margin-bottom: 15px;
  display: flex;
  justify-content: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.div`
  background: ${(props) => (props.isUser ? "linear-gradient(135deg, #6a11cb, #2575fc)" : "#e0e0e0")};
  color: ${(props) => (props.isUser ? "#fff" : "#333")};
  padding: 10px 15px;
  border-radius: ${(props) =>
    props.isUser ? "15px 15px 0 15px" : "15px 15px 15px 0"};
  max-width: 70%;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 13px; /* Reduce font size for tablets */
    padding: 8px 12px;
  }

  @media (max-width: 480px) {
    font-size: 12px; /* Reduce font size further for mobile */
    padding: 6px 10px;
  }
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 0 0 10px 10px;

  @media (max-width: 768px) {
    padding: 10px; /* Adjust padding for tablets */
  }

  @media (max-width: 480px) {
    padding: 8px; /* Further adjust padding for mobile */
  }
`;

const InputField = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #6a11cb;
    box-shadow: 0 0 5px rgba(106, 17, 203, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 14px; /* Adjust font size for tablets */
    padding: 8px;
  }

  @media (max-width: 480px) {
    font-size: 12px; /* Adjust font size for mobile */
    padding: 6px;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: #fff;
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #2575fc, #6a11cb);
  }

  @media (max-width: 768px) {
    font-size: 14px; /* Adjust font size for tablets */
    padding: 8px 15px;
    margin-left: 8px;
  }

  @media (max-width: 480px) {
    font-size: 12px; /* Adjust font size for mobile */
    padding: 6px 12px;
    margin-left: 5px;
  }
`;

export const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");

  // Using Websocket and sessions
  useEffect(() => {
    // set username and token from localstorage
    const userInfo = storage.getUser();
    setUser(userInfo?.data?.user?.username);
    setToken(userInfo?.data?.token);

    // Load chat history from Localstorage
    const savedMessages = storage.getSessions();
    setMessages(savedMessages);

    // Listen for server replies
    SOCKET.socket.on("receive_message", (data) => {
      const newMessage = { text: data, isUser: false };

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        console.log("updated messages : ", updatedMessages);
        storage.setSessions(updatedMessages); // Save to localStorage
        return updatedMessages;
      });
    });

    // Cleanup the listener when the component unmounts or re-renders
    return () => {
      SOCKET.socket.off("receive_message");
    };
  }, []);

  const handleSend = async () => {
    if (message.trim()) {
      const userMessage = { text: message, isUser: true };

      // Add user's message to chat and save to localStorage
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, userMessage];
        storage.setSessions(updatedMessages); // Save to localStorage
        return updatedMessages;
      });

      await axios
        .post(
          `${process.env.REACT_APP_STRAPI_URL_DEPLOYED}/api/messages`,
          {
            data: { user: user, message: message },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ) //Storing the messages in Strapi
        .then((res) => {
          console.log("stored message in Strapi : ", res.data);
        })
        .catch((e) => console.log("error storing data in strapi", e.message));

      // Send message to the server
      SOCKET.socket.emit("send_message", message);

      // Clear input field
      setMessage("");
    }
  };

  const handleLogout = () => {
    storage.removeUser();
    storage.removeSessions();
    SOCKET.socket.disconnect();
    GlobalSocketSet({ socket: null });
    window.location.href = "/";
  };

  return (
    <ChatboxContainer>
       <ChatboxWrapper>
      <ChatHeader>
        Chat ({user})
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </ChatHeader>
      <ChatMessagesContainer>
        {messages.map((msg, index) => (
          <Message key={index} isUser={msg.isUser}>
            <MessageBubble isUser={msg.isUser}>{msg.text}</MessageBubble>
          </Message>
        ))}
      </ChatMessagesContainer>
      <ChatInputContainer>
        <InputField
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <SendButton onClick={handleSend}>Send</SendButton>
      </ChatInputContainer>
    </ChatboxWrapper>
    </ChatboxContainer>
  );
};
