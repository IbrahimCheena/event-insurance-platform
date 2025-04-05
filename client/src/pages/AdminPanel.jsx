import { useEffect, useState } from "react";
import { auth } from "../firebase";
import axios from "axios";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const user = auth.currentUser;
        const token = await user.getIdToken();

        const [resUsers, resQuotes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/quotes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(resUsers.data.users);
        setQuotes(resQuotes.data.quotes);
      } catch (err) {
        console.error("Admin fetch error:", err);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">🛠️ Admin Dashboard</h1>

      {/* USERS */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-indigo-600 mb-4">👥 All Users</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm text-left">
            <thead className="bg-indigo-50">
              <tr>
                <th className="p-2">First Name</th>
                <th className="p-2">Last Name</th>
                <th className="p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{u.first_name}</td>
                  <td className="p-2">{u.last_name}</td>
                  <td className="p-2">{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUOTES */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-indigo-600 mb-4">📄 All Quotes</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm text-left">
            <thead className="bg-indigo-50">
              <tr>
                <th className="p-2">Event</th>
                <th className="p-2">Date</th>
                <th className="p-2">Location</th>
                <th className="p-2">Attendees</th>
                <th className="p-2">Quote ($)</th>
                <th className="p-2">User</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{q.event_type}</td>
                  <td className="p-2">{new Date(q.event_date).toDateString()}</td>
                  <td className="p-2">{q.location}</td>
                  <td className="p-2">{q.attendees}</td>
                  <td className="p-2">${q.quote_amount}</td>
                  <td className="p-2">{q.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
