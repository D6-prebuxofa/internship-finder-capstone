import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import Internships from "./pages/Internships";
import InternshipDetails from "./pages/InternshipDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/internships" element={<Internships />} />
      <Route path="/details/:id" element={<InternshipDetails />} />
    </Routes>
  );
}

export default App;