import React, { useState, useEffect } from 'react'
import { api } from '../api'

const Stores = () => {
  const [stores, setStores] = useState([])
  const [formData, setFormData] = useState({
    store_name: '',
    cnpj: '',
    address: '',
    phone_number: '',
    contact_email: '',
    status: 'on'
  })
  const [editingId, setEditingId] = useState(null)

  const statusOptions = [
    { value: 'on', label: 'Ativa' },
    { value: 'off', label: 'Inativa' }
  ]

  const fetchStores = async () => {
    try {
      const data = await api.stores.getAll()
      setStores(data)
    } catch (error) {
      console.error('Erro ao buscar lojas:', error)
      alert('Erro ao carregar lojas')
    }
  }

  useEffect(() => {
    fetchStores()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingId) {
        await api.stores.update(editingId, formData)
        alert('Loja atualizada com sucesso!')
      } else {
        await api.stores.create(formData)
        alert('Loja criada com sucesso!')
      }
      
      fetchStores()
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar loja:', error)
      alert('Erro ao salvar loja')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta loja?')) {
      try {
        await api.stores.delete(id)
        fetchStores()
        alert('Loja excluída com sucesso!')
      } catch (error) {
        console.error('Erro ao deletar loja:', error)
        alert('Erro ao excluir loja')
      }
    }
  }

  const handleEdit = (store) => {
    setFormData({
      store_name: store.store_name,
      cnpj: store.cnpj,
      address: store.address,
      phone_number: store.phone_number,
      contact_email: store.contact_email,
      status: store.status
    })
    setEditingId(store._id || store.id)
  }

  const resetForm = () => {
    setFormData({
      store_name: '',
      cnpj: '',
      address: '',
      phone_number: '',
      contact_email: '',
      status: 'on'
    })
    setEditingId(null)
  }

  const formatPhoneNumber = (phone) => {
    // Formatação básica de telefone
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  const formatCNPJ = (cnpj) => {
    // Formatação básica de CNPJ
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  const getStatusBadge = (status) => {
    return status === 'on' ? 'status-active' : 'status-inactive'
  }

  const getStatusText = (status) => {
    return status === 'on' ? 'Ativa' : 'Inativa'
  }

  return (
    <div className="component-container">
      <h1>Gerenciamento de Lojas</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <h2>{editingId ? 'Editar' : 'Nova'} Loja</h2>
        
        <div className="form-grid">
          <input
            type="text"
            placeholder="Nome da Loja"
            value={formData.store_name}
            onChange={(e) => setFormData({...formData, store_name: e.target.value})}
            required
          />
          
          <input
            type="text"
            placeholder="CNPJ (00.000.000/0000-00)"
            value={formData.cnpj}
            onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
            required
          />
          
          <input
            type="text"
            placeholder="Endereço Completo"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            required
          />
          
          <input
            type="tel"
            placeholder="Telefone (00) 00000-0000"
            value={formData.phone_number}
            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
            required
          />
          
          <input
            type="email"
            placeholder="E-mail de Contato"
            value={formData.contact_email}
            onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
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
            {editingId ? 'Atualizar' : 'Criar'} Loja
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="list-section">
        <h2>Lista de Lojas ({stores.length})</h2>
        {stores.length === 0 ? (
          <p className="no-data">Nenhuma loja encontrada</p>
        ) : (
          <div className="cards-grid">
            {stores.map((store) => (
              <div key={store._id || store.id} className="card">
                <div className="card-header">
                  <h3>{store.store_name}</h3>
                  <span className={`status-badge ${getStatusBadge(store.status)}`}>
                    {getStatusText(store.status)}
                  </span>
                </div>
                <div className="card-body">
                  <p><strong>CNPJ:</strong> {formatCNPJ(store.cnpj)}</p>
                  <p><strong>Endereço:</strong> {store.address}</p>
                  <p><strong>Telefone:</strong> {formatPhoneNumber(store.phone_number)}</p>
                  <p><strong>E-mail:</strong> {store.contact_email}</p>
                </div>
                <div className="card-actions">
                  <button onClick={() => handleEdit(store)} className="btn-edit">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(store._id || store.id)} className="btn-delete">
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

export default Stores