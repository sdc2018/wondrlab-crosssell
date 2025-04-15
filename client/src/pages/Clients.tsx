import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '../contexts/auth/AuthContext';

interface Client {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  businessUnitId: string;
  businessUnitName: string;
}

const Clients: React.FC = () => {
  const { hasRole } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    contactName: '',
    contactEmail: '',
    businessUnitId: ''
  });
  
  const canEdit = hasRole(['Admin', 'Executive']);

  // Load mock data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockClients = [
        {
          id: '1',
          name: 'Acme Corporation',
          industry: 'Technology',
          contactName: 'John Doe',
          contactEmail: 'john@acme.com',
          businessUnitId: '1',
          businessUnitName: 'Marketing'
        },
        {
          id: '2',
          name: 'Global Media',
          industry: 'Media',
          contactName: 'Jane Smith',
          contactEmail: 'jane@globalmedia.com',
          businessUnitId: '2',
          businessUnitName: 'Design'
        },
        {
          id: '3',
          name: 'Tech Innovators',
          industry: 'Technology',
          contactName: 'Mike Johnson',
          contactEmail: 'mike@techinnovators.com',
          businessUnitId: '3',
          businessUnitName: 'Technology'
        }
      ];
      setClients(mockClients);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentClient) {
      // Update existing client
      const updatedClients = clients.map(client => 
        client.id === currentClient.id 
          ? { ...currentClient, ...formData, businessUnitName: 'Marketing' } 
          : client
      );
      setClients(updatedClients);
    } else {
      // Add new client
      const newClient: Client = {
        id: Date.now().toString(),
        ...formData,
        businessUnitName: 'Marketing'
      };
      setClients([...clients, newClient]);
    }
    
    // Reset form
    setFormData({
      name: '',
      industry: '',
      contactName: '',
      contactEmail: '',
      businessUnitId: ''
    });
    setCurrentClient(null);
    setShowForm(false);
  };

  const handleEdit = (client: Client) => {
    setCurrentClient(client);
    setFormData({
      name: client.name,
      industry: client.industry,
      contactName: client.contactName,
      contactEmail: client.contactEmail,
      businessUnitId: client.businessUnitId
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(client => client.id !== id));
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading clients...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Clients</h1>
        {canEdit && (
          <button 
            onClick={() => {
              setCurrentClient(null);
              setFormData({
                name: '',
                industry: '',
                contactName: '',
                contactEmail: '',
                businessUnitId: ''
              });
              setShowForm(!showForm);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {showForm ? 'Cancel' : 'Add Client'}
          </button>
        )}
      </div>

      {/* Client Form */}
      {showForm && (
        <div className="bg-white p-6 mb-6 rounded-md shadow">
          <h2 className="text-lg font-medium mb-4">
            {currentClient ? 'Edit Client' : 'Add New Client'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Client Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Unit *</label>
                <select
                  name="businessUnitId"
                  value={formData.businessUnitId}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Business Unit</option>
                  <option value="1">Marketing</option>
                  <option value="2">Design</option>
                  <option value="3">Technology</option>
                  <option value="4">Strategy</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {currentClient ? 'Update Client' : 'Add Client'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clients Table */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Unit</th>
              {canEdit && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{client.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.industry}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">{client.contactName}</div>
                  <div className="text-gray-500">{client.contactEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.businessUnitName}</td>
                {canEdit && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(client)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(client.id)}
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

export default Clients;
