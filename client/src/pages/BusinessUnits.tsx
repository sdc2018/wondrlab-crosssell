import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '../contexts/auth/AuthContext';
import businessUnitService from '../services/api/businessUnitService';

interface BusinessUnit {
  id: string;
  name: string;
  description: string;
  headId: string;
  headName: string;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

const BusinessUnits: React.FC = () => {
  const { hasRole } = useAuth();
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBusinessUnit, setNewBusinessUnit] = useState({
    name: '',
    description: '',
    headId: ''
  });
  const [availableHeads, setAvailableHeads] = useState<any[]>([]);

  const canEdit = hasRole(['Admin', 'Executive']);

  useEffect(() => {
    // Fetch business units
    const fetchBusinessUnits = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would fetch data from the API
        // For now, we'll use mock data
        setTimeout(() => {
          const mockBusinessUnits: BusinessUnit[] = [
            {
              id: '1',
              name: 'Marketing',
              description: 'Handles all marketing activities and campaigns',
              headId: '101',
              headName: 'John Smith',
              employeeCount: 15,
              createdAt: '2023-01-15T00:00:00Z',
              updatedAt: '2023-06-20T00:00:00Z'
            },
            {
              id: '2',
              name: 'Design',
              description: 'Responsible for design and creative work',
              headId: '102',
              headName: 'Sarah Johnson',
              employeeCount: 12,
              createdAt: '2023-02-10T00:00:00Z',
              updatedAt: '2023-07-05T00:00:00Z'
            },
            {
              id: '3',
              name: 'Technology',
              description: 'Handles all technical development and IT support',
              headId: '103',
              headName: 'Michael Chen',
              employeeCount: 20,
              createdAt: '2023-01-05T00:00:00Z',
              updatedAt: '2023-08-15T00:00:00Z'
            },
            {
              id: '4',
              name: 'Strategy',
              description: 'Focuses on business strategy and planning',
              headId: '104',
              headName: 'Emily Wilson',
              employeeCount: 8,
              createdAt: '2023-03-20T00:00:00Z',
              updatedAt: '2023-09-01T00:00:00Z'
            }
          ];
          
          setBusinessUnits(mockBusinessUnits);
          
          // Mock available heads for the add form
          setAvailableHeads([
            { id: '101', name: 'John Smith' },
            { id: '102', name: 'Sarah Johnson' },
            { id: '103', name: 'Michael Chen' },
            { id: '104', name: 'Emily Wilson' },
            { id: '105', name: 'David Lee' }
          ]);
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching business units:', error);
        setError('Failed to load business units. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchBusinessUnits();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBusinessUnit({
      ...newBusinessUnit,
      [name]: value
    });
  };

  const handleAddBusinessUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBusinessUnit.name || !newBusinessUnit.headId) {
      setError('Name and Business Unit Head are required fields');
      return;
    }
    
    try {
      // In a real implementation, we would call the API
      // businessUnitService.createBusinessUnit(newBusinessUnit);
      
      // For now, we'll simulate adding a new business unit
      const head = availableHeads.find(h => h.id === newBusinessUnit.headId);
      
      const newUnit: BusinessUnit = {
        id: Date.now().toString(),
        name: newBusinessUnit.name,
        description: newBusinessUnit.description,
        headId: newBusinessUnit.headId,
        headName: head ? head.name : 'Unknown',
        employeeCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setBusinessUnits([...businessUnits, newUnit]);
      
      // Reset form
      setNewBusinessUnit({
        name: '',
        description: '',
        headId: ''
      });
      
      setShowAddForm(false);
      setError(null);
    } catch (error) {
      console.error('Error adding business unit:', error);
      setError('Failed to add business unit. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading business units...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Business Units</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the business units in your organization
          </p>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Add Business Unit
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Add Business Unit Form */}
      {showAddForm && (
        <div className="mt-6 rounded-md bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Business Unit</h3>
            <form className="mt-5 space-y-4" onSubmit={handleAddBusinessUnit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={newBusinessUnit.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={newBusinessUnit.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="headId" className="block text-sm font-medium text-gray-700">
                  Business Unit Head *
                </label>
                <select
                  id="headId"
                  name="headId"
                  value={newBusinessUnit.headId}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select a head</option>
                  {availableHeads.map((head) => (
                    <option key={head.id} value={head.id}>
                      {head.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setError(null);
                  }}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Business Units Table */}
      <div className="mt-6 overflow-hidden rounded-md border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Head
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Employees
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Created
              </th>
              {canEdit && (
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {businessUnits.map((unit) => (
              <tr key={unit.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-gray-900">{unit.name}</div>
                      <div className="text-sm text-gray-500">{unit.description}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {unit.headName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {unit.employeeCount}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(unit.createdAt).toLocaleDateString()}
                </td>
                {canEdit && (
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">
                      Edit
                    </a>
                    <a href="#" className="text-red-600 hover:text-red-900">
                      Delete
                    </a>
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

export default BusinessUnits;
