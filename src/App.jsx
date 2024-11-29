import { useEffect, useState } from "react";
import "./App.css";
import { ChatRoute, LoginRoute } from "./components";
import { BrowserRouter } from "react-router-dom";
import { storage } from "./utils/storage";
import { io } from "socket.io-client";
import { GlobalSocketSet } from "./utils/util";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let socket;
    const user = storage.getUser();
    if(user && user?.data?.token && user.data.token.length > 0){
      socket = io(import.meta.env.VITE_STRAPI_URL_DEPLOYED);
      GlobalSocketSet({ socket });
      setAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      {authenticated ? (
        <ChatRoute />
      ) : (
        <LoginRoute setAuthenticated={setAuthenticated} />
      )}
    </BrowserRouter>
  );
}

export default App;
