// import React, { useEffect, useState } from "react";
// import { FaSearch, FaTrash, FaEdit } from "react-icons/fa";
// import { profile } from "../../services/authService";

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   // Fetch Users
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await profile();   
//       setUsers(res.data || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   console.log(users);
  

//   // const handleDelete = async (id) => {
//   //   if (!window.confirm("Delete this user?")) return;
//   //   // await deleteUser(id);
//   //   fetchUsers();
//   // };

//   const filteredUsers = users.filter(
//     (u) =>
//       u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       u.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen p-6 bg-slate-50 text-slate-800">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6 text-slate-900">Users</h1>

//         {/* Search */}
//         <div className="mb-6 relative w-full md:w-96">
//           <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {/* Table */}
//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
//           {loading ? (
//             <div className="py-20 flex items-center justify-center">
//               <div className="text-center">
//                 <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                 <p className="text-slate-500 text-sm">Loading users...</p>
//               </div>
//             </div>
//           ) : filteredUsers.length === 0 ? (
//             <div className="py-20 flex items-center justify-center text-slate-500">
//               No users found.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-slate-100 text-slate-600">
//                   <tr>
//                     <th className="px-6 py-3 text-left">ID</th>
//                     <th className="px-6 py-3 text-left">Name</th>
//                     <th className="px-6 py-3 text-left">Email</th>
//                     <th className="px-6 py-3 text-left">Role</th>
//                     <th className="px-6 py-3 text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredUsers.map((user) => (
//                     <tr key={user.id} className="border-t hover:bg-slate-50">
//                       <td className="px-6 py-4 font-semibold text-indigo-600">{user.id}</td>
//                       <td className="px-6 py-4">{user.name}</td>
//                       <td className="px-6 py-4">{user.email}</td>
//                       <td className="px-6 py-4 capitalize">{user.role}</td>
//                       <td className="px-6 py-4 text-center">
//                         <div className="flex justify-center gap-2">
//                           <button className="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100">
//                             <FaEdit />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(user.id)}
//                             className="p-2 rounded-lg text-red-600 hover:bg-red-100"
//                           >
//                             <FaTrash />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Users;

import React from 'react'

const Users = () => {
  return (
    <div>Users</div>
  )
}

export default Users
