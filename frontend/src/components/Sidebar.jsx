import React from 'react'

const Sidebar = ({ activeComponent, setActiveComponent }) => {
  const menuItems = [
    { key: 'campaigns', label: 'Campanhas'},
    { key: 'orders', label: 'Pedidos'},
    { key: 'products', label: 'Produtos'},
    { key: 'stores', label: 'Lojas'},
    { key: 'suppliers', label: 'Fornecedores'},
    { key: 'users', label: 'Usuários'}
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Sistema de Gestão</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.key}
            className={`nav-button ${activeComponent === item.key ? 'active' : ''}`}
            onClick={() => setActiveComponent(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p className="version">v1.0.0</p>
      </div>
    </div>
  )
}

export default Sidebar