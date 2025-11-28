import React, { useState, useEffect } from 'react'
import { api } from '../api'

const Users = () => {
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    user: '',
    pwd: '',
    level: 'user',
    status: 'on'
  })
  const [editingId, setEditingId] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const levelOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuário' }
  ]

  const statusOptions = [
    { value: 'on', label: 'Ativo' },
    { value: 'off', label: 'Inativo' }
  ]

  const fetchUsers = async () => {
    try {
      const data = await api.users.getAll()
      setUsers(data)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      alert('Erro ao carregar usuários')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingId) {
        await api.users.update(editingId, formData)
        alert('Usuário atualizado com sucesso!')
      } else {
        await api.users.create(formData)
        alert('Usuário criado com sucesso!')
      }
      
      fetchUsers()
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      alert('Erro ao salvar usuário')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.users.delete(id)
        fetchUsers()
        alert('Usuário excluído com sucesso!')
      } catch (error) {
        console.error('Erro ao deletar usuário:', error)
        alert('Erro ao excluir usuário')
      }
    }
  }

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      contact_email: user.contact_email,
      user: user.user,
      pwd: '', // Por segurança, não preenchemos a senha no edit
      level: user.level,
      status: user.status
    })
    setEditingId(user._id || user.id)
    setShowPassword(false)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      contact_email: '',
      user: '',
      pwd: '',
      level: 'user',
      status: 'on'
    })
    setEditingId(null)
    setShowPassword(false)
  }

  const getLevelBadge = (level) => {
    return level === 'admin' ? 'level-admin' : 'level-user'
  }

  const getLevelText = (level) => {
    return level === 'admin' ? 'Administrador' : 'Usuário'
  }

  const getStatusBadge = (status) => {
    return status === 'on' ? 'status-active' : 'status-inactive'
  }

  const getStatusText = (status) => {
    return status === 'on' ? 'Ativo' : 'Inativo'
  }

  // Função para mascarar a senha na visualização
  const maskPassword = (password) => {
    return '•'.repeat(8) // Mostra 8 pontos independente do tamanho real
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="component-container">
      <h1>Gerenciamento de Usuários</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <h2>{editingId ? 'Editar' : 'Novo'} Usuário</h2>
        
        <div className="form-grid">
          <input
            type="text"
            placeholder="Nome Completo"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          
          <input
            type="email"
            placeholder="E-mail de Contato"
            value={formData.contact_email}
            onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
            required
          />
          
          <input
            type="text"
            placeholder="Nome de Usuário"
            value={formData.user}
            onChange={(e) => setFormData({...formData, user: e.target.value})}
            required
          />
          
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={editingId ? "Nova senha (deixe em branco para manter atual)" : "Senha"}
              value={formData.pwd}
              onChange={(e) => setFormData({...formData, pwd: e.target.value})}
              required={!editingId} // Só é obrigatório na criação
            />
            <button 
              type="button" 
              className="btn-password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          
          <select
            value={formData.level}
            onChange={(e) => setFormData({...formData, level: e.target.value})}
            required
          >
            {levelOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
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
            {editingId ? 'Atualizar' : 'Criar'} Usuário
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="list-section">
        <h2>Lista de Usuários ({users.length})</h2>
        {users.length === 0 ? (
          <p className="no-data">Nenhum usuário encontrado</p>
        ) : (
          <div className="cards-grid">
            {users.map((user) => (
              <div key={user._id || user.id} className="card">
                <div className="card-header">
                  <h3>{user.name}</h3>
                  <div className="badges">
                    <span className={`level-badge ${getLevelBadge(user.level)}`}>
                      {getLevelText(user.level)}
                    </span>
                    <span className={`status-badge ${getStatusBadge(user.status)}`}>
                      {getStatusText(user.status)}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <p><strong>E-mail:</strong> {user.contact_email}</p>
                  <p><strong>Usuário:</strong> {user.user}</p>
                  <p><strong>Senha:</strong> {maskPassword(user.pwd)}</p>
                  <p><strong>ID:</strong> <small>{user._id ? user._id.slice(-8) : user.id.slice(-8)}</small></p>
                </div>
                <div className="card-actions">
                  <button onClick={() => handleEdit(user)} className="btn-edit">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(user._id || user.id)} className="btn-delete">
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

export default Users