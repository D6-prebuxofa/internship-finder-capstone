import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:5000";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [navigate, user]);

  const fetchAdminData = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const usersPromise = fetch(`${API_BASE}/api/admin/users?adminId=${user._id}`).then((res) => res.json());
      const internshipsPromise = fetch(`${API_BASE}/api/admin/internships?adminId=${user._id}`).then((res) => res.json());
      const [usersData, internshipsData] = await Promise.all([usersPromise, internshipsPromise]);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setInternships(Array.isArray(internshipsData) ? internshipsData : []);
    } catch (error) {
      console.error("Admin dashboard fetch error:", error);
      alert("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user?._id]);

  useEffect(() => {
    const sectionMap = {
      "#users": "manage-users",
      "#postings": "monitor-postings"
    };
    const sectionId = sectionMap[location.hash];
    if (!sectionId) return;
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash, loading]);

  const handleRoleChange = async (targetUserId, role) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/users/${targetUserId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: user._id, role })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to update role");
        return;
      }
      fetchAdminData();
    } catch (error) {
      console.error("Update role error:", error);
      alert("Network error while updating role");
    }
  };

  const handleDeleteUser = async (targetUserId, targetUserName) => {
    const ok = window.confirm(`Delete user ${targetUserName}?`);
    if (!ok) return;

    try {
      const response = await fetch(`${API_BASE}/api/admin/users/${targetUserId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: user._id })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to delete user");
        return;
      }
      fetchAdminData();
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Network error while deleting user");
    }
  };

  const handleDeleteInternship = async (internshipId) => {
    const ok = window.confirm("Delete this internship posting as inappropriate?");
    if (!ok) return;

    try {
      const response = await fetch(`${API_BASE}/api/admin/internships/${internshipId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: user._id })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to delete internship");
        return;
      }
      fetchAdminData();
    } catch (error) {
      console.error("Delete internship error:", error);
      alert("Network error while deleting internship");
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <section className="container loading-shell">
        <h2>Loading admin dashboard...</h2>
      </section>
    );
  }

  return (
    <section className="container">
      <section id="manage-users" className="applications-section">
        <h3>Manage Users</h3>
        {users.length === 0 ? (
          <p className="muted-text">No users found.</p>
        ) : (
          <div className="applications-grid">
            {users.map((member) => (
              <article key={member._id} className="application-card">
                <p className="application-role">{member.name}</p>
                <p className="application-meta">Email: {member.email}</p>
                <p className="application-meta">Phone: {member.phone || "-"}</p>
                <div className="button-row">
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member._id, e.target.value)}
                    disabled={member._id === user._id}
                  >
                    <option value="student">student</option>
                    <option value="company">company</option>
                    <option value="admin">admin</option>
                  </select>
                  <button
                    className="button-primary"
                    disabled={member._id === user._id}
                    onClick={() => handleDeleteUser(member._id, member.name)}
                  >
                    Delete User
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="monitor-postings" className="applications-section">
        <h3>Monitor Internship Postings</h3>
        {internships.length === 0 ? (
          <p className="muted-text">No internships available.</p>
        ) : (
          <div className="dashboard-grid">
            {internships.map((internship) => (
              <article key={internship._id} className="card job-card">
                <h3>{internship.title}</h3>
                <p className="muted-text">{internship.description}</p>
                <p className="application-meta">Company: {internship.companyName || "Unknown"}</p>
                <div className="meta-row">
                  <span className="meta-chip">{internship.location}</span>
                </div>
                <button className="button-primary" onClick={() => handleDeleteInternship(internship._id)}>
                  Delete Posting
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

export default AdminDashboard;
