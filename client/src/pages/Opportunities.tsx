import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '../contexts/auth/AuthContext';

interface Opportunity {
  id: string;
  title: string;
  clientName: string;
  serviceName: string;
  value: number;
  status: 'open' | 'won' | 'lost';
  probability: number;
  expectedCloseDate: string;
  assignedToName: string;
}

const Opportunities: React.FC = () => {
  const { hasRole } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentOpportunity, setCurrentOpportunity] = useState<Opportunity | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    serviceId: '',
    value: '',
    status: 'open',
    probability: '',
    expectedCloseDate: '',
    assignedToId: ''
  });
  
  const canEdit = hasRole(['Admin', 'Executive', 'BUManager', 'SalesExec']);

  // Load mock data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockOpportunities: Opportunity[] = [
        {
          id: '1',
          title: 'Website Redesign',
          clientName: 'Acme Corporation',
          serviceName: 'UI/UX Design',
          value: 25000,
          status: 'open',
          probability: 70,
          expectedCloseDate: '2023-12-15',
          assignedToName: 'Sarah Johnson'
        },
        {
          id: '2',
          title: 'Marketing Campaign',
          clientName: 'Global Media',
          serviceName: 'Content Marketing',
          value: 15000,
          status: 'won',
          probability: 100,
          expectedCloseDate: '2023-10-30',
          assignedToName: 'John Smith'
        },
        {
          id: '3',
          title: 'Mobile App Development',
          clientName: 'Tech Innovators',
          serviceName: 'Web Development',
          value: 75000,
          status: 'open',
          probability: 50,
          expectedCloseDate: '2024-02-28',
          assignedToName: 'Michael Chen'
        }
      ];
      
      setOpportunities(mockOpportunities);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simplified form handling for demo
    if (currentOpportunity) {
      // Update existing opportunity
      const updatedOpportunities = opportunities.map(opp => 
        opp.id === currentOpportunity.id 
          ? { 
              ...currentOpportunity, 
              title: formData.title,
              value: parseFloat(formData.value),
              status: formData.status as 'open' | 'won' | 'lost',
              probability: parseInt(formData.probability),
              expectedCloseDate: formData.expectedCloseDate
            } 
          : opp
      );
      setOpportunities(updatedOpportunities);
    } else {
      // Add new opportunity (simplified)
      const newOpportunity: Opportunity = {
        id: Date.now().toString(),
        title: formData.title,
        clientName: 'New Client',
        serviceName: 'Selected Service',
        value: parseFloat(formData.value),
        status: formData.status as 'open' | 'won' | 'lost',
        probability: parseInt(formData.probability),
        expectedCloseDate: formData.expectedCloseDate,
        assignedToName: 'Current User'
      };
      setOpportunities([...opportunities, newOpportunity]);
    }
    
    // Reset form
    setFormData({
      title: '',
      clientId: '',
      serviceId: '',
      value: '',
      status: 'open',
      probability: '',
      expectedCloseDate: '',
      assignedToId: ''
    });
    setCurrentOpportunity(null);
    setShowForm(false);
  };

  const handleEdit = (opportunity: Opportunity) => {
    setCurrentOpportunity(opportunity);
    setFormData({
      title: opportunity.title,
      clientId: '1', // Simplified
      serviceId: '1', // Simplified
      value: opportunity.value.toString(),
      status: opportunity.status,
      probability: opportunity.probability.toString(),
      expectedCloseDate: opportunity.expectedCloseDate,
      assignedToId: '1' // Simplified
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      setOpportunities(opportunities.filter(opp => opp.id !== id));
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'won':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading opportunities...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Opportunities</h1>
          <p className="text-gray-600 mt-1">Manage your sales opportunities</p>
        </div>
        {canEdit && (
          <button 
            onClick={() => {
              setCurrentOpportunity(null);
              setFormData({
                title: '',
                clientId: '',
                serviceId: '',
                value: '',
                status: 'open',
                probability: '',
                expectedCloseDate: '',
                assignedToId: ''
              });
              setShowForm(!showForm);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add Opportunity'}
          </button>
        )}
      </div>

      {/* Opportunity Form - Simplified */}
      {showForm && (
        <div className="bg-white p-6 mb-6 rounded-md shadow">
          <h2 className="text-lg font-medium mb-4">
            {currentOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Value ($) *</label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="open">Open</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Probability (%) *</label>
                <input
                  type="number"
                  name="probability"
                  value={formData.probability}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expected Close Date *</label>
                <input
                  type="date"
                  name="expectedCloseDate"
                  value={formData.expectedCloseDate}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {currentOpportunity ? 'Update Opportunity' : 'Add Opportunity'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Opportunities Table */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Close Date</th>
              {canEdit && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {opportunities.map((opportunity) => (
              <tr key={opportunity.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{opportunity.title}</div>
                  <div className="text-sm text-gray-500">{opportunity.probability}% probability</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{opportunity.clientName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{opportunity.serviceName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">${opportunity.value.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(opportunity.status)}`}>
                    {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                </td>
                {canEdit && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(opportunity)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(opportunity.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Opportunities;
