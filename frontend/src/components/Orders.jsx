import React, { useState, useEffect } from 'react'
import { api } from '../api'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [stores, setStores] = useState([])
  const [products, setProducts] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [formData, setFormData] = useState({
    store_id: '',
    total_amount: '0.00',
    status: 'Pendente',
    date: new Date().toISOString().split('T')[0]
  })
  const [items, setItems] = useState([
    { product_id: '', quantity: 1, campaign_id: '', unit_price: '0.00' }
  ])
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const statusOptions = ['Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado']

  // Buscar todos os dados necessários
  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const ordersData = await api.orders.getAll()
      const storesData = await api.stores.getAll()
      const productsData = await api.products.getAll()
      const campaignsData = await api.campaigns.getAll()
      
      setOrders(ordersData)
      setStores(storesData)
      setProducts(productsData)
      setCampaigns(campaignsData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  // Adicionar novo item
  const addItem = () => {
    setItems([...items, { product_id: '', quantity: 1, campaign_id: '', unit_price: '0.00' }])
  }

  // Remover item
  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index)
      setItems(newItems)
      calculateTotal(newItems)
    }
  }

  // Atualizar item
  const updateItem = (index, field, value) => {
    const newItems = [...items]
    
    // Se estiver atualizando o produto, buscar seu preço
    if (field === 'product_id' && value) {
      const product = products.find(p => p._id === value)
      if (product && product.price) {
        newItems[index].unit_price = parseFloat(product.price).toFixed(2)
      }
    }
    
    newItems[index][field] = value
    setItems(newItems)
    calculateTotal(newItems)
  }

  // Calcular total automaticamente
  const calculateTotal = (itemsArray = items) => {
    const total = itemsArray.reduce((sum, item) => {
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

  // Formatar itens para o formato que o backend espera
  const formatItemsForBackend = () => {
    return items.map(item => {
      const productId = item.product_id || 'null'
      const quantity = item.quantity || 1
      const campaignId = item.campaign_id || 'null'
      const unitPrice = item.unit_price || '0.00'
      
      return `(${productId}, ${quantity}, ${campaignId}, ${unitPrice})`
    }).join(', ')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setError('')
    
    // Validações
    if (!formData.store_id) {
      setError('Por favor, selecione uma loja')
      return
    }
    
    const invalidItems = items.filter(item => !item.product_id)
    if (invalidItems.length > 0) {
      setError('Por favor, selecione um produto para todos os itens')
      return
    }

    // Verificar se as quantidades são válidas
    const invalidQuantity = items.some(item => !item.quantity || item.quantity <= 0)
    if (invalidQuantity) {
      setError('Quantidade deve ser maior que 0')
      return
    }

    // Criar string de itens no formato correto
    const itemsString = formatItemsForBackend()
    
    // Preparar dados para envio
    const orderData = {
      store_id: formData.store_id,
      item: `[${itemsString}]`,
      total_amount: formData.total_amount,
      status: formData.status,
      date: formData.date
    }

    try {
      setLoading(true)
      
      let result
      if (editingId) {
        // Atualizar pedido existente
        result = await api.orders.update(editingId, orderData)
        alert('Pedido atualizado com sucesso!')
      } else {
        // Criar novo pedido
        result = await api.orders.create(orderData)
        alert('Pedido criado com sucesso!')
      }
      
      fetchAllData()
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar pedido:', error)
      setError(`Erro ao salvar pedido: ${error.message || 'Tente novamente'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await api.orders.delete(id)
        fetchAllData()
        alert('Pedido excluído com sucesso!')
      } catch (error) {
        console.error('Erro ao deletar pedido:', error)
        alert('Erro ao excluir pedido')
      }
    }
  }

  // Função para parsear os itens do pedido
  const parseOrderItems = (itemString) => {
    try {
      // Remove os colchetes e parenteses
      const cleanString = itemString.replace(/[\[\]()]/g, '')
      const parts = cleanString.split(',').map(part => part.trim())
      
      const parsedItems = []
      
      // Agrupar de 4 em 4 (product_id, quantity, campaign_id, unit_price)
      for (let i = 0; i < parts.length; i += 4) {
        if (parts[i] && parts[i] !== 'null') {
          parsedItems.push({
            product_id: parts[i],
            quantity: parseInt(parts[i + 1]) || 1,
            campaign_id: parts[i + 2] && parts[i + 2] !== 'null' ? parts[i + 2] : '',
            unit_price: parseFloat(parts[i + 3] || '0').toFixed(2)
          })
        }
      }
      
      return parsedItems.length > 0 ? parsedItems : [
        { product_id: '', quantity: 1, campaign_id: '', unit_price: '0.00' }
      ]
    } catch (error) {
      console.error('Erro ao parsear itens:', error)
      return [{ product_id: '', quantity: 1, campaign_id: '', unit_price: '0.00' }]
    }
  }

  const handleEdit = (order) => {
    const parsedItems = parseOrderItems(order.item)
    
    setFormData({
      store_id: order.store_id,
      total_amount: order.total_amount,
      status: order.status || 'Pendente',
      date: order.date.split('T')[0]
    })
    
    setItems(parsedItems)
    setEditingId(order._id)
  }

  const resetForm = () => {
    setFormData({
      store_id: '',
      total_amount: '0.00',
      status: 'Pendente',
      date: new Date().toISOString().split('T')[0]
    })
    setItems([{ product_id: '', quantity: 1, campaign_id: '', unit_price: '0.00' }])
    setEditingId(null)
    setError('')
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR')
    } catch (error) {
      return dateString
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(amount || 0))
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

  // Obter nome da loja pelo ID
  const getStoreName = (storeId) => {
    if (!storeId) return 'N/A'
    const store = stores.find(s => s._id === storeId)
    return store ? store.store_name : `ID: ${storeId}`
  }

  // Obter nome do produto pelo ID
  const getProductName = (productId) => {
    if (!productId) return 'N/A'
    const product = products.find(p => p._id === productId)
    return product ? product.name : `ID: ${productId}`
  }

  // Obter nome da campanha pelo ID
  const getCampaignName = (campaignId) => {
    if (!campaignId) return 'N/A'
    const campaign = campaigns.find(c => c._id === campaignId)
    return campaign ? campaign.name : `ID: ${campaignId}`
  }

  return (
    <div className="component-container">
      <h1>Pedidos</h1>
      
      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Erro:</strong> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="form">
        <h2>{editingId ? 'Editar' : 'Novo'} Pedido</h2>
        
        <div className="form-grid">
          <select
            value={formData.store_id}
            onChange={(e) => setFormData({...formData, store_id: e.target.value})}
            required
            disabled={loading}
          >
            <option value="">Selecione uma loja</option>
            {stores.map(store => (
              <option key={store._id} value={store._id}>
                {store.store_name}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Total"
            value={formatCurrency(formData.total_amount)}
            readOnly
            className="readonly-input"
          />
          
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            required
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        {/* Seção de Itens do Pedido */}
        <div className="items-section">
          <h3>Itens do Pedido</h3>
          
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <div className="item-grid">
                <select
                  value={item.product_id}
                  onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">Selecione um produto</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name} - {formatCurrency(product.price)}
                    </option>
                  ))}
                </select>
                
                <input
                  type="number"
                  placeholder="Quantidade"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  required
                  disabled={loading}
                />
                
                <select
                  value={item.campaign_id}
                  onChange={(e) => updateItem(index, 'campaign_id', e.target.value)}
                  disabled={loading}
                >
                  <option value="">Sem campanha</option>
                  {campaigns.map(campaign => (
                    <option key={campaign._id} value={campaign._id}>
                      {campaign.name} ({campaign.discount_percentage}%)
                    </option>
                  ))}
                </select>
                
                <input
                  type="text"
                  value={formatCurrency(item.unit_price)}
                  readOnly
                  className="readonly-input"
                />
                
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="btn-remove"
                    disabled={loading}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={addItem} 
            className="btn-add-item"
            disabled={loading}
          >
            + Adicionar Item
          </button>
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar'} Pedido
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={resetForm} 
              className="btn-secondary" 
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="list-section">
        <h2>Lista de Pedidos ({orders.length})</h2>
        
        {loading ? (
          <p className="no-data">Carregando pedidos...</p>
        ) : orders.length === 0 ? (
          <p className="no-data">Nenhum pedido encontrado</p>
        ) : (
          <div className="cards-grid">
            {orders.map((order) => {
              const parsedItems = parseOrderItems(order.item)
              
              return (
                <div key={order._id} className="card">
                  <div className="card-header">
                    <div>
                      <h3>Pedido #{order._id.substring(0, 8)}...</h3>
                      <small>ID: {order._id}</small>
                    </div>
                    <span className={`status-badge ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="card-body">
                    <div className="info-row">
                      <span className="info-label">Loja:</span>
                      <span className="info-value">{getStoreName(order.store_id)}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="info-label">Data:</span>
                      <span className="info-value">{formatDate(order.date)}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="info-label">Total:</span>
                      <span className="info-value total">{formatCurrency(order.total_amount)}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="info-label">Status:</span>
                      <span className="info-value">{order.status}</span>
                    </div>
                    
                    <div className="order-items">
                      <div className="info-label">Itens ({parsedItems.length}):</div>
                      <div className="items-list">
                        {parsedItems.map((item, index) => (
                          <div key={index} className="order-item">
                            <div className="item-details">
                              <strong>{getProductName(item.product_id)}</strong>
                              <span>Qtd: {item.quantity}</span>
                              <span>Preço: {formatCurrency(item.unit_price)}</span>
                              {item.campaign_id && (
                                <span className="campaign-badge">
                                  Campanha: {getCampaignName(item.campaign_id)}
                                </span>
                              )}
                              <span className="item-subtotal">
                                Subtotal: {formatCurrency(item.unit_price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button onClick={() => handleEdit(order)} className="btn-edit" disabled={loading}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(order._id)} className="btn-delete" disabled={loading}>
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