import React, { useState, useEffect } from 'react'
import { api } from '../api'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [formData, setFormData] = useState({
    store_id: '',
    total_amount: '',
    status: 'Pendente',
    date: new Date().toISOString().split('T')[0]
  })
  const [items, setItems] = useState([
    { product_id: '', quantity: 1, campaign_id: '', unit_price: '' }
  ])
  const [editingId, setEditingId] = useState(null)

  const statusOptions = ['Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado']

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

  // Adicionar novo item
  const addItem = () => {
    setItems([...items, { product_id: '', quantity: 1, campaign_id: '', unit_price: '' }])
  }

  // Remover item
  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index)
      setItems(newItems)
    }
  }

  // Atualizar item
  const updateItem = (index, field, value) => {
    const newItems = items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    )
    setItems(newItems)
  }

  // Calcular total automaticamente
  const calculateTotal = () => {
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.unit_price) || 0
      const quantity = parseInt(item.quantity) || 0
      return sum + (price * quantity)
    }, 0)
    
    setFormData(prev => ({
      ...prev,
      total_amount: total.toFixed(2)
    }))
    
    return total
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Formatar itens para o backend
    const itemsString = items.map(item => 
      `(${item.product_id}, ${item.quantity}, ${item.campaign_id || 'null'}, ${item.unit_price})`
    ).join(', ')
    
    const orderData = {
      ...formData,
      item: `[${itemsString}]`,
      total_amount: formData.total_amount || calculateTotal().toFixed(2)
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
    const parsedItems = parseOrderItems(order.item)
    
    setFormData({
      store_id: order.store_id,
      total_amount: order.total_amount,
      status: order.status,
      date: order.date.split('T')[0]
    })
    
    setItems(parsedItems.length > 0 ? parsedItems : [
      { product_id: '', quantity: 1, campaign_id: '', unit_price: '' }
    ])
    
    setEditingId(order._id || order.id)
  }

  const resetForm = () => {
    setFormData({
      store_id: '',
      total_amount: '',
      status: 'Pendente',
      date: new Date().toISOString().split('T')[0]
    })
    setItems([{ product_id: '', quantity: 1, campaign_id: '', unit_price: '' }])
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
      'Pendente': 'status-pendente',
      'Processando': 'status-processando',
      'Enviado': 'status-enviado',
      'Entregue': 'status-entregue',
      'Cancelado': 'status-cancelado'
    }
    return statusColors[status] || 'status-pendente'
  }

  // Função para parsear os itens do pedido
  const parseOrderItems = (itemString) => {
    try {
      const items = itemString.replace(/[\[\]()]/g, '').split(',')
      const parsedItems = []
      
      for (let i = 0; i < items.length; i += 4) {
        if (items[i] && items[i + 1]) {
          parsedItems.push({
            product_id: items[i].trim(),
            quantity: parseInt(items[i + 1].trim()) || 1,
            campaign_id: items[i + 2] && items[i + 2].trim() !== 'null' ? items[i + 2].trim() : '',
            unit_price: items[i + 3] ? parseFloat(items[i + 3].trim()).toFixed(2) : ''
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

        {/* Seção de Itens do Pedido */}
        <div className="items-section">
          <h3>Itens do Pedido</h3>
          
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <div className="item-grid">
                <input
                  type="text"
                  placeholder="ID do Produto"
                  value={item.product_id}
                  onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                  required
                />
                
                <input
                  type="number"
                  placeholder="Quantidade"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    updateItem(index, 'quantity', e.target.value)
                    calculateTotal()
                  }}
                  required
                />
                
                <input
                  type="text"
                  placeholder="ID da Campanha (opcional)"
                  value={item.campaign_id}
                  onChange={(e) => updateItem(index, 'campaign_id', e.target.value)}
                />
                
                <input
                  type="number"
                  step="0.01"
                  placeholder="Preço Unitário"
                  value={item.unit_price}
                  onChange={(e) => {
                    updateItem(index, 'unit_price', e.target.value)
                    calculateTotal()
                  }}
                  required
                />
                
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <button type="button" onClick={addItem} className="btn-add-item">
            + Adicionar Item
          </button>
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
                      <strong>Itens ({parsedItems.length}):</strong>
                      {parsedItems.length > 0 ? (
                        <ul>
                          {parsedItems.map((item, index) => (
                            <li key={index}>
                              <strong>Produto:</strong> {item.product_id} | 
                              <strong> Qtd:</strong> {item.quantity} | 
                              <strong> Preço:</strong> {formatCurrency(item.unit_price)}
                              {item.campaign_id && ` | <strong>Campanha:</strong> ${item.campaign_id}`}
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