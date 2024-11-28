import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { PropTypes } from "prop-types";
import axios from "axios";
import { storage } from "../../utils/storage";
import { io } from "socket.io-client";
import { GlobalSocketSet } from "../../utils/util";

const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  font-family: "Arial", sans-serif;
`;

const SignupBox = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 400px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 28px;
  color: #333;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6a11cb;
    box-shadow: 0 0 5px rgba(106, 17, 203, 0.5);
  }
`;

const SignupButton = styled.button`
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: #fff;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;

  &:hover {
    background: linear-gradient(135deg, #2575fc, #6a11cb);
  }
`;

const Footer = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #666;

  a {
    color: #2575fc;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Signup = ({ setAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    alert("Signup button clicked");

    await axios.post(`${process.env.REACT_APP_STRAPI_URL_DEPLOYED}/api/auth/local/register`, {
        username: username,
        email: email,
        password: password,
      })
      .then((response) => {
        const newAuth = {
          token: response.data.jwt,
          user: {
            username,
            userId: response.data.user.id,
          },
        };

        const newUser = { id: Date.now().toString(), data: newAuth };
        storage.setUser(newUser);

        const socket = io(process.env.REACT_APP_STRAPI_URL_DEPLOYED); //you only requried server adress before build not after that

        GlobalSocketSet({ socket });
        setAuthenticated(true);
      })
      .catch((error) => {
        console.log(error);
        alert(error?.data?.error?.message);
        // setErrorMessage(error?.data?.error?.message);
      });
  };

  return (
    <SignupContainer>
      <SignupBox>
        <Title>Welcome Back</Title>
        <form onSubmit={handleSubmit}>
          <InputField
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SignupButton type="submit">Sign up</SignupButton>
        </form>
        <Footer>
          Already have an account? <Link to="/login">Login</Link>
        </Footer>
      </SignupBox>
    </SignupContainer>
  );
};

Signup.propTypes = {
    setAuthenticated: PropTypes.func,
}
