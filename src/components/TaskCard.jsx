"use client"

import { useState, useEffect } from "react"
import { Edit3, Trash2, AlertCircle, Calendar } from "lucide-react"

export const Priority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
}

const PriorityBadge = ({ priority }) => {
  const colors = {
    [Priority.LOW]: "badge-success",
    [Priority.MEDIUM]: "badge-warning",
    [Priority.HIGH]: "badge-error",
  }

  return (
    <div className={`badge ${colors[priority]} badge-sm md:badge-md gap-1.5 capitalize`}>
      <AlertCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />
      {priority}
    </div>
  )
}

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange, deletingTaskId }) => {
  const [isChecked, setIsChecked] = useState(task.status === "completed")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setIsChecked(task.status === "completed")
  }, [task.status])

  const handleStatusChange = async () => {
    const newStatus = !isChecked ? "completed" : "pending"
    setIsChecked(!isChecked)
    setIsUpdating(true)

    try {
      await onStatusChange(task.id, newStatus)
    } catch (error) {
      setIsChecked(isChecked)
      console.error("Failed to update task status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div
      className={`card bg-base-100 shadow-lg transition-all duration-200 hover:shadow-xl
      ${isChecked ? "opacity-75" : ""}`}
    >
      <div className="card-body p-4">
        {/* Header with Checkbox */}
        <div className="flex items-start gap-4">
          <div className="flex-none">
            <label className="label cursor-pointer p-0 flex items-center gap-3">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleStatusChange}
                disabled={isUpdating}
                className={`checkbox checkbox-primary checkbox-md
                  ${isUpdating ? "opacity-50" : ""}`}
              />
              <span
                className={`text-sm font-medium select-none whitespace-nowrap
                ${isChecked ? "text-success" : "text-base-content/70"}`}
              >
                {isChecked ? "Completed" : "Mark Complete"}
              </span>
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="mt-2">
          <h2
            className={`text-lg font-semibold mb-2
            ${isChecked ? "line-through text-base-content/70" : ""}`}
          >
            {task.title}
          </h2>
          <p
            className={`text-sm text-base-content/70 line-clamp-2 mb-4
            ${isChecked ? "line-through" : ""}`}
          >
            {task.description}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {task.due_date && (
              <div className="badge badge-ghost badge-md gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(task.due_date)}
              </div>
            )}
            {task.priority && <PriorityBadge priority={task.priority} />}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t border-base-200 pt-4">
            <button
              onClick={() => onEdit(task)}
              className="btn btn-ghost btn-sm gap-1.5 text-base-content/70 hover:text-base-content"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              disabled={deletingTaskId === task.id}
              className="btn btn-ghost btn-sm gap-1.5 text-error hover:text-error/70"
            >
              {deletingTaskId === task.id ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

