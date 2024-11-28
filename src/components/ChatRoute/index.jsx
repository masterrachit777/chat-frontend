import { Navigate, Route, Routes } from "react-router-dom";
import { Chatbox } from "../Chatbox";

export const ChatRoute = () => {
  return (
    <Routes>
      <Route path="/*" element={<Navigate to="/chat" />} />
      <Route path="/chat" exact element={<Chatbox />} />
    </Routes>
  );
};
