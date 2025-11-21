import { useEffect, useState } from "react";
import { api } from "../api";

export default function Campaign() {
  const [campaign, setCampaign] = useState([]);

  useEffect(() => {
    api.get("/api/campaign").then(setCampaign);
  }, []);

  return (
    <div>
      <h2>Campanhas</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID Fornecedor</th>
            <th>Nome</th>
            <th>Data de início</th>
            <th>Data final</th>
            <th>Porcentagem de desconto</th>
          </tr>
        </thead>
        <tbody>
          {campaign.map((u) => (
            <tr key={u._id}>
              <td>{u.supplier_id}</td>
              <td>{u.name}</td>
              <td>{u.start_date}</td>
              <td>{u.end_date}</td>
              <td>{u.discount_percentage} %</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
