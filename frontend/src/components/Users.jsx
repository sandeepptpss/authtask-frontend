import React, { useState, useEffect } from "react";
import '../assets/users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '', _id: '' });

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

    const fetchUserProfile = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8002/api/user-profile/${userId}`);
            const data = await response.json();
            setSelectedProfile(data);
            alert(`Name: ${data.name}\nEmail: ${data.email}\nRole: ${data.role}`);
        } catch (error) {
            console.error("Error fetching profile:", error);
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

    const openEditForm = (user) => {
        setEditData({ name: user.name, email: user.email, _id: user._id });
        setIsEditing(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8002/api/update-user/${editData._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editData.name, email: editData.email }),
            });

            const result = await response.json();

            if (response.ok) {
                setUsers(prev =>
                    prev.map(u => u._id === editData._id ? { ...u, name: editData.name, email: editData.email } : u)
                );
                setIsEditing(false);
            } else {
                console.error("Failed to update user:", result.message);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <div className="users-container">
            <h2 className="table-title">User List</h2>
            <div className="table-wrapper">
                <table className="user-table">
                <thead>
                   <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Profile</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Actions</th>
                   </tr>
                    </thead>
                    <tbody>
           {users.map((user, index) => (
        <tr key={user._id}>
            <td>{index + 1}</td>
            <td onClick={() => fetchUserProfile(user._id)} className="clickable-name">
                {user.name}
            </td>
            <td>{user.email}</td>
            <td>
                <img 
                    src={user?.profile ? `http://localhost:8002/${user.profile}` : "http://localhost:8002/uploads/images/Signup-1741170871891.png"}
                    alt={user.name}
                    className="profile-image"
                />
            </td>
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
            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
            <td>
                <div className="action-icons">
                    <div className="icon-button edit" title="Edit User" onClick={() => openEditForm(user)}>
                        ✏️
                    </div>
                    <div className="icon-button delete" title="Delete User" onClick={() => deleteUser(user._id)}>
                        🗑️
                    </div>
                </div>
            </td>
        </tr>
    ))}
</tbody>
    </table>
</div>
    {/* Edit Modal */}
            {isEditing && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Edit User</h3>
                        <form onSubmit={handleEditSubmit}>
                            <label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    placeholder="Name"
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    required
                                />
                            </label>
                            <label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    required
                                />
                            </label>
                            <div className="modal-actions">
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
