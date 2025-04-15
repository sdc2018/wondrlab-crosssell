import React, { useState, useEffect } from 'react';

enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedTo: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    dueDate: '',
    assignedTo: ''
  });

  // Load mock data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Prepare client presentation',
          description: 'Create slides for the upcoming client meeting',
          status: TaskStatus.PENDING,
          priority: TaskPriority.HIGH,
          dueDate: '2023-11-15',
          assignedTo: 'John Smith'
        },
        {
          id: '2',
          title: 'Follow up on proposal',
          description: 'Call the client to discuss the proposal details',
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.MEDIUM,
          dueDate: '2023-11-10',
          assignedTo: 'Sarah Johnson'
        },
        {
          id: '3',
          title: 'Update service documentation',
          description: 'Review and update the documentation for our web development service',
          status: TaskStatus.COMPLETED,
          priority: TaskPriority.LOW,
          dueDate: '2023-11-05',
          assignedTo: 'Michael Chen'
        }
      ];
      
      setTasks(mockTasks);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentTask) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === currentTask.id 
          ? { 
              ...currentTask, 
              title: formData.title,
              description: formData.description,
              status: formData.status as TaskStatus,
              priority: formData.priority as TaskPriority,
              dueDate: formData.dueDate,
              assignedTo: formData.assignedTo
            } 
          : task
      );
      setTasks(updatedTasks);
    } else {
      // Add new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        status: formData.status as TaskStatus,
        priority: formData.priority as TaskPriority,
        dueDate: formData.dueDate,
        assignedTo: formData.assignedTo || 'Current User'
      };
      
      setTasks([...tasks, newTask]);
    }
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      dueDate: '',
      assignedTo: ''
    });
    setCurrentTask(null);
    setShowForm(false);
  };

  const handleEdit = (task: Task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus } 
        : task
    ));
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading tasks...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <button 
          onClick={() => {
            setCurrentTask(null);
            setFormData({
              title: '',
              description: '',
              status: TaskStatus.PENDING,
              priority: TaskPriority.MEDIUM,
              dueDate: '',
              assignedTo: ''
            });
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {/* Task Form */}
      {showForm && (
        <div className="bg-white p-6 mb-6 rounded-md shadow">
          <h2 className="text-lg font-medium mb-4">
            {currentTask ? 'Edit Task' : 'Add New Task'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-4">
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
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value={TaskStatus.PENDING}>Pending</option>
                    <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TaskStatus.COMPLETED}>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value={TaskPriority.LOW}>Low</option>
                    <option value={TaskPriority.MEDIUM}>Medium</option>
                    <option value={TaskPriority.HIGH}>High</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date *</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Assigned To</label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {currentTask ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-md shadow">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">{task.title}</h3>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === TaskPriority.HIGH ? 'bg-red-100 text-red-800' :
                  task.priority === TaskPriority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.status === TaskStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                  task.status === TaskStatus.IN_PROGRESS ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {task.status === TaskStatus.IN_PROGRESS ? 'In Progress' : 
                   task.status === TaskStatus.COMPLETED ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
            <p className="text-gray-600 mt-2">{task.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                <span className="ml-4">Assigned to: {task.assignedTo}</span>
              </div>
              <div className="flex space-x-3">
                {task.status !== TaskStatus.COMPLETED && (
                  <button
                    onClick={() => handleStatusChange(task.id, TaskStatus.COMPLETED)}
                    className="text-green-600"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={() => handleEdit(task)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
