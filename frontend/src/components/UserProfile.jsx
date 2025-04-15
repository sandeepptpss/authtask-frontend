import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await fetch("http://localhost:8002/api/view-user-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          if ([401, 403].includes(response.status)) {
            localStorage.removeItem("token");
            navigate("/login");
          }
          throw new Error(errorData.message || "Failed to fetch profile");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h2>User Profile</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user ? (
        <div>
          <img
            src={user.profile ? `http://localhost:8002/${user.profile}` : "https://via.placeholder.com/120"}
            alt="Profile"
            width={120}
            height={120}
          />
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Gender:</strong> {user.gender || "Not specified"}</p>
        </div>
      ) : (
        !error && <p>No profile data found</p>
      )}
    </div>
  );
};

export default UserProfile;