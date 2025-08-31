"use client"
// pages/permissions.tsx
import { PermissionResponse, RoleResponse, UserResponse } from '@/components/constants/types';
import { assignPermissionsToRole, assignRolesToUser, createRole, createUser, getPermissions, getRoles, getUsers } from '@/components/lib/api';
import { showToast } from '@/utils/toastUtil';
import React, { useEffect, useState } from 'react';

const PermissionsPage = () => {
  // Roles
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [newRoleName, setNewRoleName] = useState('');

  // Permissions
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedPermissionId, setSelectedPermissionId] = useState('');

  // Users
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoleForUser, setSelectedRoleForUser] = useState('');

  // Create User
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', password: '', role: '' });

  // Load roles, permissions, users on mount
  useEffect(() => {
    const fetchData = async () => {
      setRoles(await getRoles());
      setPermissions(await getPermissions());
      setUsers(await getUsers());
    };
    fetchData();
  }, []);

  // Handlers
  const handleCreateRole = async () => {
    if (!newRoleName) return;
    const res = await createRole({ roleName: newRoleName });
    if (res.isSuccess) {
      setRoles(await getRoles());
      setNewRoleName('');
      showToast(res.message === undefined ? "Rol oluşturuldu" : res.message, "success");
    } else showToast(res.message === undefined ? "Rol oluşturulurken hata" : res.message, "error");
  };

  const handleAssignPermission = async () => {
    if (!selectedRoleId || !selectedPermissionId) return;
    const roleName = roles.find(r => r.id === selectedRoleId)?.name || '';
    const permissionName = permissions.find(p => p.id === selectedPermissionId)?.name || '';
    const res = await assignPermissionsToRole({ roleName, permissions: [permissionName] });
    if (res.isSuccess) showToast(res.message === undefined ? "Role yetki başarıyla atandı" : res.message, "success");
    else showToast(res.message === undefined ? "Role yetki atanırken hata" : res.message, "error");
  };

  const handleAssignRoleToUser = async () => {
    if (!selectedUserId || !selectedRoleForUser) return;
    const res = await assignRolesToUser({ userId: selectedUserId, roles: [selectedRoleForUser] });
    if (res.isSuccess) showToast(res.message === undefined ? "Rol kullanıcıya atandı" : res.message, "success");
    else showToast(res.message === undefined ? "Kullanıcıya rol atanırken hata" : res.message, "error");
  };

  const handleCreateUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) return;
    const res = await createUser({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      password: newUser.password,
      roles: newUser.role ? [newUser.role] : []
    });
    if (res.isSuccess) {
      showToast(res.message === undefined ? "Kullanıcı başarılı bir şekilde oluşturuldu" : res.message, "success");
      setUsers(await getUsers());
      setNewUser({ firstName: '', lastName: '', email: '', password: '', role: '' });
    } else showToast(res.message === undefined ? "Kullanıcı oluşturulurken hata" : res.message, "error");
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Role & Permission Management</h1>

      {/* Create Role */}
      <div className="p-4 bg-white dark:bg-gray-dark rounded-md border border-gray-300 dark:border-gray-700">
        <h2 className="font-semibold mb-2">Create New Role</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Role Name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            className="border rounded p-2 flex-1"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCreateRole}>
            Create
          </button>
        </div>
      </div>

      {/* Assign Permission to Role */}
      <div className="p-4 bg-white dark:bg-gray-dark rounded-md border border-gray-300 dark:border-gray-700">
        <h2 className="font-semibold mb-2">Assign Permission to Role</h2>
        <div className="flex gap-2">
          <select className="border rounded p-2 flex-1" value={selectedRoleId} onChange={(e) => setSelectedRoleId(e.target.value)}>
            <option value="">Select Role</option>
            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select className="border rounded p-2 flex-1" value={selectedPermissionId} onChange={(e) => setSelectedPermissionId(e.target.value)}>
            <option value="">Select Permission</option>
            {permissions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAssignPermission}>
            Assign
          </button>
        </div>
      </div>

      {/* Assign Role to User */}
      <div className="p-4 bg-white dark:bg-gray-dark rounded-md border border-gray-300 dark:border-gray-700">
        <h2 className="font-semibold mb-2">Assign Role to User</h2>
        <div className="flex gap-2">
          <select className="border rounded p-2 flex-1" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
            <option value="">Select User</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
          </select>
          <select className="border rounded p-2 flex-1" value={selectedRoleForUser} onChange={(e) => setSelectedRoleForUser(e.target.value)}>
            <option value="">Select Role</option>
            {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
          <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={handleAssignRoleToUser}>
            Assign
          </button>
        </div>
      </div>

      {/* Create User */}
      <div className="p-4 bg-white dark:bg-gray-dark rounded-md border border-gray-300 dark:border-gray-700">
        <h2 className="font-semibold mb-2">Create New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <input type="text" placeholder="First Name" value={newUser.firstName} onChange={e => setNewUser({ ...newUser, firstName: e.target.value })} className="border rounded p-2 col-span-1"/>
          <input type="text" placeholder="Last Name" value={newUser.lastName} onChange={e => setNewUser({ ...newUser, lastName: e.target.value })} className="border rounded p-2 col-span-1"/>
          <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="border rounded p-2 col-span-1"/>
          <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="border rounded p-2 col-span-1"/>
          <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="border rounded p-2 col-span-1">
            <option value="">Select Role (optional)</option>
            {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
        </div>
        <button className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded" onClick={handleCreateUser}>
          Create User
        </button>
      </div>
    </div>
  );
};

export default PermissionsPage;
