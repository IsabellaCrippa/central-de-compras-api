import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    supplier_id: '',
    name: '',
    start_date: '',
    end_date: '',
    discount_percentage: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [supplierFilter, setSupplierFilter] = useState('');

  // Buscar todas as campanhas
  const fetchCampaigns = async () => {
    try {
      const data = await api.campaigns.getAll();
      setCampaigns(data);
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      alert('Erro ao carregar campanhas');
    }
  };

  // Buscar campanhas por fornecedor
  const fetchCampaignsBySupplier = async (supplierId) => {
    if (!supplierId) {
      fetchCampaigns();
      return;
    }
    try {
      const data = await api.campaigns.getBySupplier(supplierId);
      setCampaigns(data);
    } catch (error) {
      console.error('Erro ao buscar campanhas por fornecedor:', error);
      alert('Erro ao buscar campanhas por fornecedor');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const campaignData = {
      ...formData,
      discount_percentage: Number(formData.discount_percentage)
    };

    try {
      if (editingId) {
        await api.campaigns.update(editingId, campaignData);
        alert('Campanha atualizada com sucesso!');
      } else {
        await api.campaigns.create(campaignData);
        alert('Campanha criada com sucesso!');
      }
      
      fetchCampaigns();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar campanha:', error);
      alert('Erro ao salvar campanha');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
      try {
        await api.campaigns.delete(id);
        fetchCampaigns();
        alert('Campanha excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar campanha:', error);
        alert('Erro ao excluir campanha');
      }
    }
  };

  const handleEdit = (campaign) => {
    setFormData({
      supplier_id: campaign.supplier_id,
      name: campaign.name,
      start_date: campaign.start_date.split('T')[0],
      end_date: campaign.end_date.split('T')[0],
      discount_percentage: campaign.discount_percentage.toString()
    });
    setEditingId(campaign._id || campaign.id);
  };

  const resetForm = () => {
    setFormData({
      supplier_id: '',
      name: '',
      start_date: '',
      end_date: '',
      discount_percentage: ''
    });
    setEditingId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isCampaignActive = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  return (
    <div className="component-container">
      <h1>Gerenciamento de Campanhas</h1>
      
      {/* Formulário */}
      <form onSubmit={handleSubmit} className="form">
        <h2>{editingId ? 'Editar' : 'Nova'} Campanha</h2>
        
        <div className="form-grid">
          <input
            type="text"
            placeholder="ID do Fornecedor"
            value={formData.supplier_id}
            onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
            required
          />
          
          <input
            type="text"
            placeholder="Nome da Campanha"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          
          <input
            type="date"
            placeholder="Data de Início"
            value={formData.start_date}
            onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            required
          />
          
          <input
            type="date"
            placeholder="Data de Término"
            value={formData.end_date}
            onChange={(e) => setFormData({...formData, end_date: e.target.value})}
            required
          />
          
          <input
            type="number"
            placeholder="Percentual de Desconto"
            min="0"
            max="100"
            value={formData.discount_percentage}
            onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
            required
          />
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {editingId ? 'Atualizar' : 'Criar'} Campanha
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de Campanhas */}
      <div className="list-section">
        <h2>Lista de Campanhas ({campaigns.length})</h2>
        {campaigns.length === 0 ? (
          <p className="no-data">Nenhuma campanha encontrada</p>
        ) : (
          <div className="cards-grid">
            {campaigns.map((campaign) => {
              const isActive = isCampaignActive(campaign.start_date, campaign.end_date);
              
              return (
                <div key={campaign._id || campaign.id} className="card">
                  <div className="card-header">
                    <h3>{campaign.name}</h3>
                    <div className="badges">
                      <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
                        {isActive ? 'Ativa' : 'Inativa'}
                      </span>
                      <span className="discount-badge">{campaign.discount_percentage}% OFF</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <p><strong>Fornecedor:</strong> {campaign.supplier_id}</p>
                    <p><strong>Início:</strong> {formatDate(campaign.start_date)}</p>
                    <p><strong>Término:</strong> {formatDate(campaign.end_date)}</p>
                    <p><strong>Desconto:</strong> {campaign.discount_percentage}%</p>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => handleEdit(campaign)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(campaign._id || campaign.id)} className="btn-delete">
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;