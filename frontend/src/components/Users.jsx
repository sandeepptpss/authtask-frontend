import React, { useState, useEffect } from "react";
import '../assets/users.css';

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://localhost:8002/api/view-user`);
            const data = await response.json();
            setUsers(data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const toggleVerification = async (userId, currentStatus) => {
        try {
            const newStatus = !currentStatus;

            const response = await fetch(`http://localhost:8002/api/update-verification/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ verified: newStatus }),
            });

            if (response.ok) {
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user._id === userId ? { ...user, verified: newStatus } : user
                    )
                );
            } else {
                console.error("Failed to update user verification status");
            }
        } catch (error) {
            console.error("Error updating user", error);
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await fetch(`http://localhost:8002/api/delete-user/${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();

            if (response.ok) {
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            } else {
                console.error("Failed to delete user from backend", result.message);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="users-container">
            <h2 className="table-title">User List</h2>
            <div className="table-wrapper">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Verified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.role === "admin" ? (
                                        <span className="admin-role">🛡️ Admin</span>
                                    ) : (
                                        "User"
                                    )}
                                </td>
                                <td>
                                    <span
                                        className={`status-badge ${user.verified ? "verified" : "not-verified"}`}
                                        onClick={() => toggleVerification(user._id, user.verified)}
                                    >
                                        {user.verified ? "✅ Verified" : "❌ Not Verified"}
                                    </span>
                                </td>
                                <td>
                                    <div
                                        className="icon-button delete"
                                        title="Delete User"
                                        onClick={() => deleteUser(user._id)}
                                    >
                                        🗑️
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
