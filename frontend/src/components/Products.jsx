import React, { useState, useEffect } from 'react'
import { api } from '../api'

const Products = () => {
  const [products, setProducts] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    supplier_id: '',
    status: 'on'
  })
  const [editingId, setEditingId] = useState(null)
  const [supplierFilter, setSupplierFilter] = useState('')

  const statusOptions = [
    { value: 'on', label: 'Ativo' },
    { value: 'off', label: 'Inativo' }
  ]

  const fetchProducts = async () => {
    try {
      const data = await api.products.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      alert('Erro ao carregar produtos')
    }
  }

  const fetchProductsBySupplier = async (supplierId) => {
    if (!supplierId) {
      fetchProducts()
      return
    }
    try {
      const data = await api.products.getBySupplier(supplierId)
      setProducts(data)
    } catch (error) {
      console.error('Erro ao buscar produtos por fornecedor:', error)
      alert('Erro ao buscar produtos por fornecedor')
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock_quantity)
    }

    try {
      if (editingId) {
        await api.products.update(editingId, productData)
        alert('Produto atualizado com sucesso!')
      } else {
        await api.products.create(productData)
        alert('Produto criado com sucesso!')
      }
      
      fetchProducts()
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      alert('Erro ao salvar produto')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.products.delete(id)
        fetchProducts()
        alert('Produto excluído com sucesso!')
      } catch (error) {
        console.error('Erro ao deletar produto:', error)
        alert('Erro ao excluir produto')
      }
    }
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      supplier_id: product.supplier_id,
      status: product.status
    })
    setEditingId(product._id || product.id)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      supplier_id: '',
      status: 'on'
    })
    setEditingId(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    return status === 'on' ? 'status-active' : 'status-inactive'
  }

  const getStatusText = (status) => {
    return status === 'on' ? 'Ativo' : 'Inativo'
  }

  const getStockLevel = (quantity) => {
    if (quantity === 0) return 'stock-out'
    if (quantity <= 5) return 'stock-low'
    return 'stock-good'
  }

  const getStockText = (quantity) => {
    if (quantity === 0) return 'Sem Estoque'
    if (quantity <= 5) return 'Estoque Baixo'
    return 'Em Estoque'
  }

  return (
    <div className="component-container">
      <h1>Gerenciamento de Produtos</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <h2>{editingId ? 'Editar' : 'Novo'} Produto</h2>
        
        <div className="form-grid">
          <input
            type="text"
            placeholder="Nome do Produto"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          
          <textarea
            placeholder="Descrição do Produto"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="3"
            required
          />
          
          <input
            type="number"
            step="0.01"
            placeholder="Preço"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />
          
          <input
            type="number"
            placeholder="Quantidade em Estoque"
            value={formData.stock_quantity}
            onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
            min="0"
            required
          />
          
          <input
            type="text"
            placeholder="ID do Fornecedor"
            value={formData.supplier_id}
            onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
            required
          />
          
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            required
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {editingId ? 'Atualizar' : 'Criar'} Produto
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="filter-section">
        <h3>Filtrar por Fornecedor</h3>
        <div className="filter-controls">
          <input
            type="text"
            placeholder="Digite o ID do fornecedor"
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
          />
          <button onClick={() => fetchProductsBySupplier(supplierFilter)} className="btn-primary">
            Filtrar
          </button>
          <button onClick={fetchProducts} className="btn-secondary">
            Limpar Filtro
          </button>
        </div>
      </div>

      <div className="list-section">
        <h2>Lista de Produtos ({products.length})</h2>
        {products.length === 0 ? (
          <p className="no-data">Nenhum produto encontrado</p>
        ) : (
          <div className="cards-grid">
            {products.map((product) => (
              <div key={product._id || product.id} className="card">
                <div className="card-header">
                  <h3>{product.name}</h3>
                  <div className="badges">
                    <span className={`status-badge ${getStatusBadge(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
                    <span className={`stock-badge ${getStockLevel(product.stock_quantity)}`}>
                      {getStockText(product.stock_quantity)}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <p><strong>Descrição:</strong> {product.description}</p>
                  <p><strong>Preço:</strong> {formatCurrency(product.price)}</p>
                  <p><strong>Estoque:</strong> {product.stock_quantity} unidades</p>
                  <p><strong>Fornecedor:</strong> {product.supplier_id}</p>
                </div>
                <div className="card-actions">
                  <button onClick={() => handleEdit(product)} className="btn-edit">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(product._id || product.id)} className="btn-delete">
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products