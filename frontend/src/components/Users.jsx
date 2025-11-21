import { useEffect, useState } from "react";
import { api } from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/api/users").then(setUsers);
  }, []);

  return (
    <div>
      <h2>Usuários</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>User</th>
            <th>Nível</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.contact_email}</td>
              <td>{u.user}</td>
              <td>{u.level}</td>
              <td>{u.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
