import React from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks";
import { Home, Login, LoginUrl, Success } from "./views";
// firebase 
import { firebase } from "./helpers/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth(firebase);

function App() {
  const {user, setUser} = useAuth();

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    } else {
      setUser(null);
    }
  });

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/success" element={<Success />} />
      <Route path="/login-url" element={<LoginUrl />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
