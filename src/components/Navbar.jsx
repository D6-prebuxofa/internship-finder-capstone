import { useNavigate } from "react-router-dom";

const Navbar = ({ theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isCompany = user?.role === "company";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="navbar">
      <button className="logo logo-button" onClick={() => navigate("/dashboard")}>INTERNSHIP FINDER</button>

      <div className="nav-actions">
        {user && <span className="nav-user">{user.name}</span>}
        {isCompany ? (
          <>
            <button className="button-light" onClick={() => navigate("/company/dashboard#post")}>
              Post Internship
            </button>
            <button className="button-light" onClick={() => navigate("/company/dashboard#listings")}>
              My Listings
            </button>
            <button className="button-light" onClick={() => navigate("/company/dashboard#applications")}>
              Applications
            </button>
          </>
        ) : (
          <>
            <button className="button-light" onClick={() => navigate("/dashboard#profile")}>
              Edit Profile
            </button>
            <button className="button-light" onClick={() => navigate("/dashboard#my-applications")}>
              My Applications
            </button>
          </>
        )}
        <button className="button-light" onClick={onToggleTheme}>
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
        <button className="button-light" onClick={() => navigate(isCompany ? "/company/dashboard" : "/dashboard")}>
          Dashboard
        </button>
        <button className="button-light" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
