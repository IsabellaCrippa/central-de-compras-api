import { useEffect, useState } from "react";
import { api } from "../api";

export default function Order() {
  const [order, setOrder] = useState([]);

  useEffect(() => {
    api.get("/api/order").then(setOrder);
  }, []);

  return (
    <div>
      <h2>Pedidos</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID da loja</th>
            <th>Item</th>
            <th>Valor total</th>
            <th>Status</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {order.map((u) => (
            <tr key={u._id}>
              <td>{u._id}</td>
              <td>{u.store_id}</td>
              <td>{u.item}</td>
              <td>{u.total_amount}</td>
              <td>{u.status}</td>
              <td>{u.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
