import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import InternshipDetails from "./pages/InternshipDetails";

function App() {
  const location = useLocation();
  const showNavbar = !["/", "/register"].includes(location.pathname);

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <>
      {showNavbar && <Navbar theme={theme} onToggleTheme={toggleTheme} />}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/details/:id" element={<InternshipDetails />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
