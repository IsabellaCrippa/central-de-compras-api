import { useState } from "react";
import Sidebar from "./components/Sidebar";

import Users from "./components/Users";
import Suppliers from "./components/Suppliers";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Stores from "./components/Stores";
import Campaigns from "./components/Campaigns";

export default function App() {
  const [current, setCurrent] = useState("users");

  const screens = {
    users: <Users />,
    suppliers: <Suppliers />,
    products: <Products />,
    orders: <Orders />,
    stores: <Stores />,
    campaigns: <Campaigns />
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar current={current} setCurrent={setCurrent} />
      <div style={{ padding: "20px", flex: 1 }}>
        {screens[current]}
      </div>
    </div>
  );
}
