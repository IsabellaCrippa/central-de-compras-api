import React, { useState, useEffect } from 'react'
import { api } from '../api'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [formData, setFormData] = useState({
    store_id: '',
    item: '',
    total_amount: '',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  })
  const [editingId, setEditingId] = useState(null)

  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

  const fetchOrders = async () => {
    try {
      const data = await api.orders.getAll()
      setOrders(data)
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
      alert('Erro ao carregar pedidos')
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const orderData = {
      ...formData,
      total_amount: parseFloat(formData.total_amount).toFixed(2)
    }

    try {
      if (editingId) {
        await api.orders.update(editingId, orderData)
        alert('Pedido atualizado com sucesso!')
      } else {
        await api.orders.create(orderData)
        alert('Pedido criado com sucesso!')
      }
      
      fetchOrders()
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar pedido:', error)
      alert('Erro ao salvar pedido')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await api.orders.delete(id)
        fetchOrders()
        alert('Pedido excluído com sucesso!')
      } catch (error) {
        console.error('Erro ao deletar pedido:', error)
        alert('Erro ao excluir pedido')
      }
    }
  }

  const handleEdit = (order) => {
    setFormData({
      store_id: order.store_id,
      item: order.item,
      total_amount: order.total_amount,
      status: order.status,
      date: order.date.split('T')[0]
    })
    setEditingId(order._id || order.id)
  }

  const resetForm = () => {
    setFormData({
      store_id: '',
      item: '',
      total_amount: '',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    })
    setEditingId(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'status-pending',
      'Processing': 'status-processing',
      'Shipped': 'status-shipped',
      'Delivered': 'status-delivered',
      'Cancelled': 'status-cancelled'
    }
    return statusColors[status] || 'status-pending'
  }

  // Função para parsear os itens do pedido (formato: [(product_id, quantity, campaign_id, unit_price)...])
  const parseOrderItems = (itemString) => {
    try {
      // Remove colchetes e divide por vírgula
      const items = itemString.replace(/[\[\]()]/g, '').split(',')
      const parsedItems = []
      
      // Agrupa em grupos de 4 (product_id, quantity, campaign_id, unit_price)
      for (let i = 0; i < items.length; i += 4) {
        if (items[i] && items[i + 1]) {
          parsedItems.push({
            product_id: items[i].trim(),
            quantity: parseInt(items[i + 1].trim()),
            campaign_id: items[i + 2] ? items[i + 2].trim() : null,
            unit_price: items[i + 3] ? parseFloat(items[i + 3].trim()) : null
          })
        }
      }
      return parsedItems
    } catch (error) {
      console.error('Erro ao parsear itens:', error)
      return []
    }
  }

  return (
    <div className="component-container">
      <h1>Gerenciamento de Pedidos</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <h2>{editingId ? 'Editar' : 'Novo'} Pedido</h2>
        
        <div className="form-grid">
          <input
            type="text"
            placeholder="ID da Loja"
            value={formData.store_id}
            onChange={(e) => setFormData({...formData, store_id: e.target.value})}
            required
          />
          
          <textarea
            placeholder="Itens do Pedido (formato: [(product_id, quantity, campaign_id, unit_price)...])"
            value={formData.item}
            onChange={(e) => setFormData({...formData, item: e.target.value})}
            rows="3"
            required
          />
          
          <input
            type="number"
            step="0.01"
            placeholder="Valor Total"
            value={formData.total_amount}
            onChange={(e) => setFormData({...formData, total_amount: e.target.value})}
            required
          />
          
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            required
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {editingId ? 'Atualizar' : 'Criar'} Pedido
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="list-section">
        <h2>Lista de Pedidos ({orders.length})</h2>
        {orders.length === 0 ? (
          <p className="no-data">Nenhum pedido encontrado</p>
        ) : (
          <div className="cards-grid">
            {orders.map((order) => {
              const parsedItems = parseOrderItems(order.item)
              
              return (
                <div key={order._id || order.id} className="card">
                  <div className="card-header">
                    <h3>Pedido #{order._id ? order._id.slice(-8) : order.id.slice(-8)}</h3>
                    <span className={`status-badge ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <p><strong>Loja:</strong> {order.store_id}</p>
                    <p><strong>Data:</strong> {formatDate(order.date)}</p>
                    <p><strong>Total:</strong> {formatCurrency(order.total_amount)}</p>
                    
                    <div className="order-items">
                      <strong>Itens:</strong>
                      {parsedItems.length > 0 ? (
                        <ul>
                          {parsedItems.map((item, index) => (
                            <li key={index}>
                              Produto: {item.product_id}, 
                              Qtd: {item.quantity}
                              {item.campaign_id && `, Campanha: ${item.campaign_id}`}
                              {item.unit_price && `, Preço: ${formatCurrency(item.unit_price)}`}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Itens não disponíveis</p>
                      )}
                    </div>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => handleEdit(order)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(order._id || order.id)} className="btn-delete">
                      Excluir
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders