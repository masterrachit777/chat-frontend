import { useEffect, useState } from "react";
import styled from "styled-components";
import { GlobalSocketSet, SOCKET } from "../../utils/util";
import { storage } from "../../utils/storage";
import axios from "axios";

const ChatboxContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: "Arial", sans-serif;
  @media (max-width: 480px) {
    overflow: auto;
  }
`;

const ChatboxWrapper = styled.div`
  width: 80%;
  height: 100%;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  font-family: "Arial", sans-serif;

  @media (max-width: 1024px) {
    width: 70%; /* Adjust width for tablets */
  }

  @media (max-width: 768px) {
    width: 60%; /* Adjust width for small tablets or large phones */
  }

  @media (max-width: 480px) {
    min-width: min-content;
    width: 55%; /* Almost full width for mobile devices */
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
  background: ${(props) =>
    props.isUser ? "linear-gradient(135deg, #6a11cb, #2575fc)" : "#e0e0e0"};
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

const SessionSidebar = styled.div`
  width: 20%;
  background: #f3f3f3;
  padding: 10px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  background: lightgrey;

  @media (max-width: 1024px) {
    width: 30%; /* Adjust width for tablets */
  }

  @media (max-width: 768px) {
    width: 40%; /* Adjust width for small tablets or large phones */
  }

  @media (max-width: 480px) {
    min-width: max-content;
    width: 45%; /* Almost full width for mobile devices */
  }
`;

const SessionItem = styled.div`
  padding: 10px;
  background: ${(props) => (props.active === true ? "#6a11cb" : "#fff")};
  color: ${(props) => (props.active === true ? "#fff" : "#333")};
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.active ? "#5a0eb8" : "#eee")};
  }
`;

const CreateSessionButton = styled.button`
  margin-top: auto; /* Push button to the bottom of the sidebar */
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: linear-gradient(135deg, #2575fc, #6a11cb);
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 12px;
  }
`;

export const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null); // ID of the current session

  // Using Websocket and sessions
  useEffect(() => {
    // set username and token from localstorage
    const userInfo = storage.getUser();
    setUser(userInfo?.data?.user);
    setToken(userInfo?.data?.token);

    // Load chat history from Localstorage
    if (activeSession) {
      fetchMessages(activeSession);
    }

    // Listen for server replies
    SOCKET.socket.on("receive_message", (data) => {
      createMessage(data, "server");
    });

    // Cleanup the listener when the component unmounts or re-renders
    return () => {
      SOCKET.socket.off("receive_message");
    };
  }, [activeSession]);

  const handleSend = async () => {
    if (message.trim()) {
      createMessage(message, user.username);
      // Send message to the server
      SOCKET.socket.emit("send_message", message);
      // Clear input field
      setMessage("");
    }
  };

  const createMessage = async (message, userType) => {
    await axios
      .post(
        `${import.meta.env.VITE_STRAPI_URL_DEPLOYED}/api/messages`,
        {
          data: {
            user: userType,
            message: message,
            session: activeSession,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ) //Storing the messages in Strapi
      .then((res) => {
        console.log("stored message in Strapi : ", res.data);
        setMessages((prevMessages) => [...prevMessages, res.data.data]);
      })
      .catch((e) =>
        console.log(
          "error storing data in strapi",
          e?.response?.data?.error?.message
        )
      );
  };

  const handleLogout = () => {
    storage.removeUser();
    SOCKET.socket.disconnect();
    GlobalSocketSet({ socket: null });
    window.location.href = "/";
  };

  // Fetch user sessions on mount
  const fetchSessions = async () => {
    await axios
      .get(
        `${
          import.meta.env.VITE_STRAPI_URL_DEPLOYED
        }/api/sessions?populate=*&filters[user][documentId]=${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ) //Storing the messages in Strapi
      .then(async (res) => {
        console.log("sessions for current user", res.data);
        if (res.data.data.length === 0) {
          // Create a default session if no sessions exist
          console.log("no session exists!");
          await handleCreateSession("Default Chat");
        } else {
          console.log("in here bitch");
          let sortedSessions = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setSessions(sortedSessions);
          setActiveSession(sortedSessions[0].documentId);
          fetchMessages(sortedSessions[0].documentId);
        }
      })
      .catch((e) => console.log("error fetching sessions", e));
  };

  useEffect(() => {
    if (user.userId && !activeSession) {
      fetchSessions();
    }
  }, [user, token]);

  const fetchMessages = async (sessionId) => {
    await axios
      .get(
        `${
          import.meta.env.VITE_STRAPI_URL_DEPLOYED
        }/api/messages?populate=*&filters[session][documentId]=${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (res) => {
        console.log("messages for current session", res.data);
        setMessages(res.data.data);
      })
      .catch((e) =>
        console.log("error fetching messages for current session", e)
      );
  };

  const handleSessionSwitch = (sessionId) => {
    console.log("current session to be switched : ", sessionId);
    setActiveSession(sessionId);
    fetchMessages(sessionId);
  };

  const handleCreateSession = async (sessionName) => {
    console.log("user-id is: ", user.userId);
    await axios
      .post(
        `${import.meta.env.VITE_STRAPI_URL_DEPLOYED}/api/sessions`,
        {
          data: {
            sessionName: sessionName,
            userId: user.username,
            user: user.userId,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ) //creating new session
      .then(async (res) => {
        console.log("created session : ", res.data);

        setSessions((prevSessions) => [...prevSessions, res.data.data]);
        setActiveSession(res.data.data.documentId);
        setMessages([]);
      })
      .catch((e) => console.log("error creating session", e));
  };

  return (
    <ChatboxContainer>
      <SessionSidebar>
        {sessions &&
          sessions.length > 0 &&
          sessions.map((session) => (
            <SessionItem
              key={session.documentId}
              active={session.documentId === activeSession}
              onClick={() => handleSessionSwitch(session.documentId)}
            >
              {session.sessionName}
            </SessionItem>
          ))}
        <CreateSessionButton
          onClick={() =>
            handleCreateSession(`New Session ${sessions.length + 1}`)
          }
        >
          + Create New Session
        </CreateSessionButton>
      </SessionSidebar>
      <ChatboxWrapper>
        <ChatHeader>
          Chat ({user.username})
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </ChatHeader>
        <ChatMessagesContainer>
          {messages &&
            messages.length > 0 &&
            messages.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)).map((msg, index) => (
              <Message
                key={index}
                isUser={msg.user === "server" ? false : true}
              >
                <MessageBubble isUser={msg.user === "server" ? false : true}>
                  {msg.message}
                </MessageBubble>
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
