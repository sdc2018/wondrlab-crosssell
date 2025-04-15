import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '../contexts/auth/AuthContext';

const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    tasks: { total: 0, pending: 0, inProgress: 0, completed: 0 },
    opportunities: { total: 0, open: 0, won: 0, lost: 0 }
  });
  const [recentTasks, setRecentTasks] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would fetch data from the API
        // For now, we'll use mock data
        setTimeout(() => {
          setStats({
            tasks: { total: 12, pending: 5, inProgress: 4, completed: 3 },
            opportunities: { total: 8, open: 5, won: 2, lost: 1 }
          });
          
          setRecentTasks([
            { id: 1, title: 'Prepare client presentation', status: 'pending', priority: 'high' },
            { id: 2, title: 'Review proposal', status: 'in_progress', priority: 'medium' },
            { id: 3, title: 'Schedule follow-up meeting', status: 'completed', priority: 'low' },
            { id: 4, title: 'Update service catalog', status: 'pending', priority: 'medium' },
            { id: 5, title: 'Send contract draft', status: 'in_progress', priority: 'high' }
          ]);
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-gray-500">Welcome back, {user?.name || 'User'}!</p>

      {/* Stats Overview */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Task Stats */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-blue-500 p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tasks</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.tasks.total}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Pending: {stats.tasks.pending}</span>
                <span>In Progress: {stats.tasks.inProgress}</span>
                <span>Completed: {stats.tasks.completed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunity Stats */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-green-500 p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Opportunities</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.opportunities.total}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Open: {stats.opportunities.open}</span>
                <span>Won: {stats.opportunities.won}</span>
                <span>Lost: {stats.opportunities.lost}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
        <div className="mt-2 overflow-hidden rounded-lg bg-white shadow">
          {recentTasks.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentTasks.map((task) => (
                <li key={task.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mr-3 ${
                        task.status === 'completed' ? 'bg-green-500' :
                        task.status === 'in_progress' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                    </div>
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>No recent tasks found.</p>
            </div>
          )}
          <div className="bg-gray-50 px-6 py-3">
            <a href="/tasks" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all tasks →
            </a>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <a href="/tasks/new" className="block rounded-lg bg-white p-6 shadow hover:bg-gray-50">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="ml-3 text-base font-medium text-gray-900">New Task</span>
            </div>
          </a>
          
          {hasRole(['Admin', 'Executive', 'BUManager', 'SalesExec']) && (
            <a href="/opportunities/new" className="block rounded-lg bg-white p-6 shadow hover:bg-gray-50">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="ml-3 text-base font-medium text-gray-900">New Opportunity</span>
              </div>
            </a>
          )}
          
          {hasRole(['Admin', 'Executive']) && (
            <a href="/clients/new" className="block rounded-lg bg-white p-6 shadow hover:bg-gray-50">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="ml-3 text-base font-medium text-gray-900">New Client</span>
              </div>
            </a>
          )}
          
          {hasRole(['Admin', 'Executive', 'BUManager']) && (
            <a href="/cross-sell-matrix" className="block rounded-lg bg-white p-6 shadow hover:bg-gray-50">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="ml-3 text-base font-medium text-gray-900">Cross-Sell Matrix</span>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
