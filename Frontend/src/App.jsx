import { Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ResetPassword from "./Pages/ResetPassword";
import CreateTask from "./Pages/CreateTask";
import AppLayout from "./Pages/AppLayout";

function App() {
  console.log("Rendering App component");

  return (
    <>
      <Routes>
        {/* Routes that do not need the sidebar */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<Login />} />
        <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />
        
        {/* Routes that need the sidebar */}
        {/* <Route path="/" element={<AppLayout />}> */}
          <Route path="/create-task" element={<CreateTask />} />
        {/* </Route> */}
      </Routes>
    </>
  );
}

export default App;
