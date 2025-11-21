import { useEffect, useState } from "react";
import { api } from "../api";

export default function Store() {
  const [store, setStore] = useState([]);

  useEffect(() => {
    api.get("/api/store").then(setStore);
  }, []);

  return (
    <div>
      <h2>Lojas</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Loja</th>
            <th>CNPJ</th>
            <th>Endereço</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {store.map((u) => (
            <tr key={u._id}>
              <td>{u.store_name}</td>
              <td>{u.cnpj}</td>
              <td>{u.address}</td>
              <td>{u.contact_email}</td>
              <td>{u.phone_number}</td>
              <td>{u.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
