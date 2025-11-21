import { useEffect, useState } from "react";
import { api } from "../api";

export default function Product() {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    api.get("/api/product").then(setProduct);
  }, []);

  return (
    <div>
      <h2>Produtos</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Quantia no estoque</th>
            <th>Fornecedor ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {product.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.description}</td>
              <td>{u.price}</td>
              <td>{u.stock_quantity}</td>
              <td>{u.supplier_id}</td>
              <td>{u.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
