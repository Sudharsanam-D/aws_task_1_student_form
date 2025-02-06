import React from "react";
import { Routes, Route } from "react-router-dom";
import UserForm from "./UserForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserForm />} />
    </Routes>
  );
}

export default App;
