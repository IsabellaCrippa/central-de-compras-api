import React, { useState, useEffect } from 'react'
import { api } from '../api'

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([])
  const [formData, setFormData] = useState({
    supplier_name: '',
    supplier_category: '',
    contact_email: '',
    phone_number: '',
    status: 'on'
  })
  const [editingId, setEditingId] = useState(null)

  const statusOptions = [
    { value: 'on', label: 'Ativo' },
    { value: 'off', label: 'Inativo' }
  ]

  // Categorias pré-definidas para sugestão
  const categorySuggestions = [
    'Informática',
    'Segurança',
    'Eletrônicos',
    'Móveis',
    'Material de Escritório',
    'Limpeza',
    'Alimentação',
    'Vestuário',
    'Automotivo',
    'Construção'
  ]

  const fetchSuppliers = async () => {
    try {
      const data = await api.suppliers.getAll()
      setSuppliers(data)
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error)
      alert('Erro ao carregar fornecedores')
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingId) {
        await api.suppliers.update(editingId, formData)
        alert('Fornecedor atualizado com sucesso!')
      } else {
        await api.suppliers.create(formData)
        alert('Fornecedor criado com sucesso!')
      }
      
      fetchSuppliers()
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error)
      alert('Erro ao salvar fornecedor')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await api.suppliers.delete(id)
        fetchSuppliers()
        alert('Fornecedor excluído com sucesso!')
      } catch (error) {
        console.error('Erro ao deletar fornecedor:', error)
        alert('Erro ao excluir fornecedor')
      }
    }
  }

  const handleEdit = (supplier) => {
    setFormData({
      supplier_name: supplier.supplier_name,
      supplier_category: supplier.supplier_category,
      contact_email: supplier.contact_email,
      phone_number: supplier.phone_number,
      status: supplier.status
    })
    setEditingId(supplier._id)
  }

  const resetForm = () => {
    setFormData({
      supplier_name: '',
      supplier_category: '',
      contact_email: '',
      phone_number: '',
      status: 'on'
    })
    setEditingId(null)
  }

  const formatPhoneNumber = (phone) => {
    // Formatação básica de telefone
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  const getStatusBadge = (status) => {
    return status === 'on' ? 'status-active' : 'status-inactive'
  }

  const getStatusText = (status) => {
    return status === 'on' ? 'Ativo' : 'Inativo'
  }

  // Função para separar categorias por vírgula
  const renderCategories = (categories) => {
    return categories.split(',').map(cat => cat.trim()).join(', ')
  }

  return (
    <div className="component-container">
      <h1>Gerenciamento de Fornecedores</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <h2>{editingId ? 'Editar' : 'Novo'} Fornecedor</h2>
        
        <div className="form-grid">
          <input
            type="text"
            placeholder="Nome do Fornecedor"
            value={formData.supplier_name}
            onChange={(e) => setFormData({...formData, supplier_name: e.target.value})}
            required
          />
          
          <div className="form-field">
            <input
              type="text"
              placeholder="Categoria"
              value={formData.supplier_category}
              onChange={(e) => setFormData({...formData, supplier_category: e.target.value})}
              list="category-suggestions"
              required
            />
            <datalist id="category-suggestions">
              {categorySuggestions.map((category, index) => (
                <option key={index} value={category} />
              ))}
            </datalist>
          </div>
          
          <input
            type="email"
            placeholder="E-mail de Contato"
            value={formData.contact_email}
            onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
            required
          />
          
          <input
            type="tel"
            placeholder="Telefone (00) 00000-0000"
            value={formData.phone_number}
            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
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
            {editingId ? 'Atualizar' : 'Criar'} Fornecedor
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="list-section">
        <h2>Lista de Fornecedores ({suppliers.length})</h2>
        {suppliers.length === 0 ? (
          <p className="no-data">Nenhum fornecedor encontrado</p>
        ) : (
          <div className="cards-grid">
            {suppliers.map((supplier) => (
              <div key={supplier._id} className="card">
                <div className="card-header">
                  <div className="supplier-info">
                    <h3>{supplier.supplier_name}</h3>
                    <div className="supplier-id-row">
                      <span className="id-label">ID:</span>
                      <span className="supplier-id">{supplier._id}</span>
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusBadge(supplier.status)}`}>
                    {getStatusText(supplier.status)}
                  </span>
                </div>
                <div className="card-body">
                  <div className="info-row">
                    <span className="info-label">Categorias:</span>
                    <span className="info-value categories">
                      {renderCategories(supplier.supplier_category)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">E-mail:</span>
                    <span className="info-value">{supplier.contact_email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Telefone:</span>
                    <span className="info-value">{formatPhoneNumber(supplier.phone_number)}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <button onClick={() => handleEdit(supplier)} className="btn-edit">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(supplier._id)} className="btn-delete">
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

export default Suppliers