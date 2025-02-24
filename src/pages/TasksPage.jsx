import { useState, useEffect, use } from "react";
import { TasksContext } from "../contexts/tasksContext";
import { PlusCircle, Circle, X } from "lucide-react";
import { TaskCard } from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

const TasksUI = () => {
  const context = use(TasksContext);
  const { fetchTasks, tasks, loading, createTask, deleteTask, updateTask } =
    context;
  const authContext = use(AuthContext);
  
  const { isPaid,fetchUser } = authContext;
   

  useEffect(() => {
    fetchUser();
    fetchTasks();
    
  }, []);

  

 

  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "pending",
    priority: "",
  });

  const resetForm = () => {
    setTaskData({
      title: "",
      description: "",
      due_date: "",
      status: "pending",
      priority: "",
    });
    setIsEditing(false);
    setCurrentTaskId(null);
    setModalOpen(false);
  };

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleEdit = (task) => {
    setTaskData({
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      status: task.status,
      priority: task.priority || "",
    });
    setCurrentTaskId(task.id);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (taskId) => {
    setDeletingTaskId(taskId);
    try {
      await deleteTask(taskId);
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = { ...taskData };
    if (!isPaid) delete submitData.priority;

    try {
      if (isEditing) {
        await updateTask(currentTaskId, submitData);
      } else {
        await createTask(submitData);
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="card-title text-2xl sm:text-3xl font-bold">
                Task Manager
              </h1>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/app/payment"
                  className="btn btn-outline btn-primary btn-sm sm:btn-md"
                >
                  Upgrade to Premium
                </Link>
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn btn-primary btn-sm sm:btn-md gap-2"
                >
                  <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {loading && tasks.length === 0 && (
            <div className="card bg-base-100 shadow-lg col-span-full">
              <div className="card-body items-center text-center p-8">
                <div className="loading loading-spinner loading-lg text-primary"></div>
                <p className="mt-4 text-base-content/70">
                  Loading your tasks...
                </p>
              </div>
            </div>
          )}

          {!loading && tasks.length === 0 && (
            <div className="card bg-base-100 shadow-lg col-span-full">
              <div className="card-body items-center text-center p-8">
                <Circle className="w-16 h-16 text-base-content/20 mb-4" />
                <h3 className="text-xl font-bold mb-2">No Tasks Yet</h3>
                <p className="text-base-content/70 mb-6">
                  Get started by creating your first task
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn btn-primary btn-wide"
                >
                  Create Task
                </button>
              </div>
            </div>
          )}

          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              deletingTaskId={deletingTaskId}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="modal-box relative bg-base-100 w-full max-w-lg">
            <button
              onClick={resetForm}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-6">
                {isEditing ? "Edit Task" : "Create New Task"}
              </h3>
              <TaskForm
                taskData={taskData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
                isEditing={isEditing}
                loading={loading}
                isPaid={isPaid}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksUI;
