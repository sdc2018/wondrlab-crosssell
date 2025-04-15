import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth/AuthContext';
import { UserRole } from '../services/api/userService';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  businessUnitId: string;
  businessUnitName: string;
}

const Services: React.FC = () => {
  const { hasRole } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    businessUnitId: ''
  });
  
  const canEdit = hasRole([UserRole.ADMIN, UserRole.MANAGEMENT, UserRole.BU_HEAD]);

  // Load mock data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockServices = [
        {
          id: '1',
          name: 'Brand Strategy',
          description: 'Comprehensive brand strategy development',
          category: 'Strategy',
          businessUnitId: '1',
          businessUnitName: 'Marketing'
        },
        {
          id: '2',
          name: 'UI/UX Design',
          description: 'User interface and experience design',
          category: 'Design',
          businessUnitId: '2',
          businessUnitName: 'Design'
        },
        {
          id: '3',
          name: 'Web Development',
          description: 'Full-stack web application development',
          category: 'Development',
          businessUnitId: '3',
          businessUnitName: 'Technology'
        },
        {
          id: '4',
          name: 'Content Marketing',
          description: 'Content strategy and creation',
          category: 'Marketing',
          businessUnitId: '1',
          businessUnitName: 'Marketing'
        },
        {
          id: '5',
          name: 'Business Consulting',
          description: 'Strategic business consulting services',
          category: 'Consulting',
          businessUnitId: '4',
          businessUnitName: 'Strategy'
        }
      ];
      setServices(mockServices);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get business unit name based on ID (in a real app, this would come from a lookup)
    const businessUnitMap: {[key: string]: string} = {
      '1': 'Marketing',
      '2': 'Design',
      '3': 'Technology',
      '4': 'Strategy'
    };
    
    if (currentService) {
      // Update existing service
      const updatedServices = services.map(service => 
        service.id === currentService.id 
          ? { 
              ...currentService, 
              ...formData, 
              businessUnitName: businessUnitMap[formData.businessUnitId] || 'Unknown'
            } 
          : service
      );
      setServices(updatedServices);
    } else {
      // Add new service
      const newService: Service = {
        id: Date.now().toString(),
        ...formData,
        businessUnitName: businessUnitMap[formData.businessUnitId] || 'Unknown'
      };
      setServices([...services, newService]);
    }
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      businessUnitId: ''
    });
    setCurrentService(null);
    setShowForm(false);
  };

  const handleEdit = (service: Service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      businessUnitId: service.businessUnitId
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading services...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-gray-600 mt-1">Manage your organization's service offerings</p>
        </div>
        {canEdit && (
          <button 
            onClick={() => {
              setCurrentService(null);
              setFormData({
                name: '',
                description: '',
                category: '',
                businessUnitId: ''
              });
              setShowForm(!showForm);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add Service'}
          </button>
        )}
      </div>

      {/* Service Form */}
      {showForm && (
        <div className="bg-white p-6 mb-6 rounded-md shadow">
          <h2 className="text-lg font-medium mb-4">
            {currentService ? 'Edit Service' : 'Add New Service'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Name *</label>
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
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
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
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {currentService ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-md shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {service.category}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{service.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Business Unit: <span className="font-medium">{service.businessUnitName}</span>
                </p>
              </div>
              {canEdit && (
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
