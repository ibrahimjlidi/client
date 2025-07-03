import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';

const UserList = () => {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [editUser, setEditUser] = useState(null);
    const [editForm, setEditForm] = useState({ role: '', status: '' });

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch('/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleEdit = (user) => {
        setEditUser(user);
        setEditForm({ role: user.role, status: user.status });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/users/${editUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                fetchUsers();
                setEditUser(null);
            }
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    // Filtering
    let filteredUsers = users;
    if (filterRole) filteredUsers = filteredUsers.filter(u => u.role === filterRole);
    if (filterStatus) filteredUsers = filteredUsers.filter(u => u.status === filterStatus);

    if (loading) return <div className="p-8">Chargement...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Gestion des Utilisateurs</h1>
            <div className="flex gap-4 mb-4">
                <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="p-2 border rounded">
                    <option value="">Tous les rôles</option>
                    <option value="admin">Admin</option>
                    <option value="client">Client</option>
                    <option value="fournisseur">Fournisseur</option>
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="p-2 border rounded">
                    <option value="">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="suspended">Suspendu</option>
                </select>
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Nom</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Rôle</th>
                        <th className="py-2">Statut</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(u => (
                        <tr key={u._id}>
                            <td className="border px-4 py-2">{u.firstName} {u.lastName}</td>
                            <td className="border px-4 py-2">{u.email}</td>
                            <td className="border px-4 py-2 capitalize">{u.role}</td>
                            <td className="border px-4 py-2 capitalize">{u.status}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => handleEdit(u)} className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 mr-2">Modifier</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            {editUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Modifier Utilisateur</h3>
                            <button onClick={() => setEditUser(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rôle</label>
                                <select name="role" value={editForm.role} onChange={handleEditChange} className="w-full p-2 border rounded">
                                    <option value="admin">Admin</option>
                                    <option value="client">Client</option>
                                    <option value="fournisseur">Fournisseur</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Statut</label>
                                <select name="status" value={editForm.status} onChange={handleEditChange} className="w-full p-2 border rounded">
                                    <option value="active">Actif</option>
                                    <option value="inactive">Inactif</option>
                                    <option value="suspended">Suspendu</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Enregistrer</button>
                                <button type="button" onClick={() => setEditUser(null)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList; 