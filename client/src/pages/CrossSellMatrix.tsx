import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth/AuthContext';
import { UserRole } from '../services/api/userService';

interface Client {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
}

interface MatrixCell {
  clientId: string;
  serviceId: string;
  status: 'active' | 'opportunity' | 'none';
  score: number;
}

const CrossSellMatrix: React.FC = () => {
  const { hasRole } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [matrixData, setMatrixData] = useState<MatrixCell[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const canEdit = hasRole([UserRole.ADMIN, UserRole.MANAGEMENT, UserRole.BU_HEAD]);

  // Load mock data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock clients
      const mockClients: Client[] = [
        { id: '1', name: 'Acme Corporation' },
        { id: '2', name: 'Global Media' },
        { id: '3', name: 'Stellar Designs' },
        { id: '4', name: 'Strategic Partners' }
      ];
      
      // Mock services
      const mockServices: Service[] = [
        { id: '1', name: 'Brand Strategy' },
        { id: '2', name: 'UI/UX Design' },
        { id: '3', name: 'Web Development' },
        { id: '4', name: 'Content Marketing' }
      ];
      
      // Mock matrix data
      const mockMatrixData: MatrixCell[] = [
        // Acme Corporation
        { clientId: '1', serviceId: '1', status: 'none', score: 60 },
        { clientId: '1', serviceId: '2', status: 'active', score: 0 },
        { clientId: '1', serviceId: '3', status: 'active', score: 0 },
        { clientId: '1', serviceId: '4', status: 'opportunity', score: 85 },
        
        // Global Media
        { clientId: '2', serviceId: '1', status: 'active', score: 0 },
        { clientId: '2', serviceId: '2', status: 'opportunity', score: 75 },
        { clientId: '2', serviceId: '3', status: 'none', score: 50 },
        { clientId: '2', serviceId: '4', status: 'active', score: 0 },
        
        // Stellar Designs
        { clientId: '3', serviceId: '1', status: 'opportunity', score: 80 },
        { clientId: '3', serviceId: '2', status: 'active', score: 0 },
        { clientId: '3', serviceId: '3', status: 'opportunity', score: 90 },
        { clientId: '3', serviceId: '4', status: 'none', score: 55 },
        
        // Strategic Partners
        { clientId: '4', serviceId: '1', status: 'none', score: 35 },
        { clientId: '4', serviceId: '2', status: 'none', score: 40 },
        { clientId: '4', serviceId: '3', status: 'opportunity', score: 70 },
        { clientId: '4', serviceId: '4', status: 'none', score: 45 }
      ];
      
      setClients(mockClients);
      setServices(mockServices);
      setMatrixData(mockMatrixData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Get cell data for a specific client and service
  const getCellData = (clientId: string, serviceId: string) => {
    return matrixData.find(cell => cell.clientId === clientId && cell.serviceId === serviceId);
  };

  // Update cell status
  const updateCellStatus = (clientId: string, serviceId: string) => {
    if (!canEdit) return;
    
    setMatrixData(prevData => 
      prevData.map(cell => {
        if (cell.clientId === clientId && cell.serviceId === serviceId) {
          // Cycle through statuses: none -> opportunity -> active -> none
          const newStatus = 
            cell.status === 'none' ? 'opportunity' :
            cell.status === 'opportunity' ? 'active' : 'none';
          return { ...cell, status: newStatus };
        }
        return cell;
      })
    );
  };

  // Get top opportunities
  const getTopOpportunities = () => {
    return matrixData
      .filter(cell => cell.status === 'opportunity')
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(cell => {
        const client = clients.find(c => c.id === cell.clientId);
        const service = services.find(s => s.id === cell.serviceId);
        return {
          ...cell,
          clientName: client?.name || '',
          serviceName: service?.name || ''
        };
      });
  };

  // Get cell background color based on status and score
  const getCellBackground = (cell?: MatrixCell) => {
    if (!cell) return 'bg-gray-100';
    
    switch (cell.status) {
      case 'active':
        return 'bg-green-100';
      case 'opportunity':
        return cell.score >= 80 ? 'bg-red-100' : 
               cell.score >= 60 ? 'bg-yellow-100' : 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading cross-sell matrix...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Cross-Sell Matrix</h1>
        <p className="text-gray-600 mt-1">Identify cross-selling opportunities across clients and services</p>
      </div>

      {/* Top Opportunities */}
      <div className="bg-white p-6 mb-6 rounded-md shadow">
        <h2 className="text-lg font-medium mb-4">Top Cross-Sell Opportunities</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getTopOpportunities().map((opp, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{opp.clientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{opp.serviceName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            opp.score >= 80 ? 'bg-green-500' : 
                            opp.score >= 60 ? 'bg-yellow-500' : 'bg-blue-500'
                          }`} 
                          style={{ width: `${opp.score}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm text-gray-900">{opp.score}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-Sell Matrix */}
      <div className="bg-white p-6 rounded-md shadow overflow-x-auto">
        <h2 className="text-lg font-medium mb-4">Matrix View</h2>
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 bg-gray-50 p-2"></th>
              {services.map(service => (
                <th key={service.id} className="border border-gray-200 bg-gray-50 p-2 text-xs font-medium text-gray-500">
                  {service.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td className="border border-gray-200 bg-gray-50 p-2 text-xs font-medium text-gray-500">
                  {client.name}
                </td>
                {services.map(service => {
                  const cell = getCellData(client.id, service.id);
                  return (
                    <td 
                      key={service.id} 
                      className={`border border-gray-200 p-2 text-center ${getCellBackground(cell)}`}
                      onClick={() => updateCellStatus(client.id, service.id)}
                      style={{ cursor: canEdit ? 'pointer' : 'default' }}
                    >
                      {cell?.status === 'active' && (
                        <span className="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
                      )}
                      {cell?.status === 'opportunity' && (
                        <div className="text-sm font-medium">{cell.score}%</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {canEdit && (
          <p className="text-sm text-gray-500 mt-4">Click on a cell to change its status.</p>
        )}
      </div>
    </div>
  );
};

export default CrossSellMatrix;
