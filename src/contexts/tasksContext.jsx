
import React, { createContext,  useState, useEffect } from 'react';
import apiFetch from '../apiFetch'; 
import Toast from '../components/Toast'; 

const TasksContext = createContext(null);

 const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Helper to clear the toast notification
  const clearToast = () => setToast(null);

  // Fetch all tasks for the authenticated user
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('tasks', { method: 'GET' });
      const result = await response.json();
      if (response.ok) {
        
        setTasks(result.data);
       
      } 
    } catch (err) {
      setToast({ message: err.message, success: false });
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData) => {
    setLoading(true);
    try {
      const response = await apiFetch('tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      const result = await response.json();
      if (response.ok) {
        // Append the new task to the tasks list
        setTasks(prevTasks => [...prevTasks, result.data]);
        setToast({ message: result.message, success: true });
      } else {
        setToast({ message: result.message || 'Error creating task', success: false });
      }
    } catch (err) {
      setToast({ message: err.message, success: false });
    } finally {
      setLoading(false);
    }
  };

  // Update an existing task
  const updateTask = async (taskId, taskData) => {
    setLoading(true);
    try {
      const response = await apiFetch(`tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
      });
      const result = await response.json();
      if (response.ok) {
        setTasks(prevTasks =>
          prevTasks.map(task => (task.id === taskId ? result.data : task))
        );
        setToast({ message: result.message, success: true });
      } else {
        setToast({ message: result.message || 'Error updating task', success: false });
      }
    } catch (err) {
      setToast({ message: err.message, success: false });
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      const response = await apiFetch(`tasks/${taskId}`, { method: 'DELETE' });
      const result = await response.json();
      if (response.ok) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        setToast({ message: result.message, success: true });
      } else {
        setToast({ message: result.message || 'Error deleting task', success: false });
      }
    } catch (err) {
      setToast({ message: err.message, success: false });
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TasksContext
      value={{
        tasks,
        loading,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.message}
          success={toast.success}
          onClose={clearToast}
        />
      )}
    </TasksContext>
  );
};

 export {TasksContext , TasksProvider};
