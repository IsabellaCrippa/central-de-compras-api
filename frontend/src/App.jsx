import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Campaigns from './components/Campaigns'
import Orders from './components/Orders'
import Products from './components/Products'
import Stores from './components/Stores'
import Suppliers from './components/Suppliers'
import Users from './components/Users'
import './App.css'

function App() {
  const [activeComponent, setActiveComponent] = useState('campaigns')

  const renderComponent = () => {
    switch (activeComponent) {
      case 'campaigns':
        return <Campaigns />
      case 'orders':
        return <Orders />
      case 'products':
        return <Products />
      case 'stores':
        return <Stores />
      case 'suppliers':
        return <Suppliers />
      case 'users':
        return <Users />
      default:
        return <Campaigns />
    }
  }

  return (
    <div className="app">
      <Sidebar 
        activeComponent={activeComponent} 
        setActiveComponent={setActiveComponent} 
      />
      <main className="main-content">
        {renderComponent()}
      </main>
    </div>
  )
}

export default App