
import { useState,useEffect } from "react"
import { Priority } from "./TaskCard"

const TaskForm = ({ taskData, handleChange, handleSubmit, resetForm, isEditing, isPaid }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)


 
  const onSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await handleSubmit(e)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="form-control gap-4">
      <div>
        <label className="label">
          <span className="label-text font-medium">Title</span>
        </label>
        <input
          type="text"
          name="title"
          value={taskData.title}
          onChange={handleChange}
          className="input input-bordered w-full"
          placeholder="Enter task title"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text font-medium">Description</span>
        </label>
        <textarea
          name="description"
          value={taskData.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full h-24"
          placeholder="Enter task description"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text font-medium">Due Date</span>
        </label>
        <input
          type="date"
          name="due_date"
          value={taskData.due_date}
          onChange={handleChange}
          className="input input-bordered w-full"
          disabled={isSubmitting}
        />
      </div>

      {isPaid && (
        <div>
          <label className="label">
            <span className="label-text font-medium">Priority</span>
          </label>
          <select
            name="priority"
            value={taskData.priority}
            onChange={handleChange}
            className="select select-bordered w-full"
            disabled={isSubmitting}
          >
            <option value="">Select priority</option>
            <option value={Priority.LOW}>Low</option>
            <option value={Priority.MEDIUM}>Medium</option>
            <option value={Priority.HIGH}>High</option>
          </select>
        </div>
      )}

      <div className="modal-action gap-2">
        <button type="button" onClick={resetForm} className="btn btn-ghost" disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary min-w-[100px]" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="loading loading-ring loading-sm"></span>
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Task"
          ) : (
            "Create Task"
          )}
        </button>
      </div>
    </form>
  )
}

export default TaskForm

