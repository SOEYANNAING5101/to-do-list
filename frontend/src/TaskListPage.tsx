import EditTaskModal from './modal/EditTaskModal'
import { useGetTasks,useDeleteTask, type UpdateTask } from './hooks/useTask'
import { useState } from 'react';



export default function TaskListPage() {
  const { data: tasks = [] } = useGetTasks();
  const deleteTaskMutation = useDeleteTask();

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<UpdateTask | null>(null);

  const handleOpenModal = (task: UpdateTask) => {
    setIsEditModalOpen(true);
    setSelectedTask(task);
  }
  const handleDelete = (task_id:string) =>{
    const confirmDelete = window.confirm('Are you sure')
    if (!confirmDelete) return;
    deleteTaskMutation.mutate(task_id);
  }
  return (
    <div>
      Task list page
      {tasks.map((task) => {
        return (<div className='flex gap-3'>
          <span>{task.title}</span>
          <span>{task.description}</span>
          <span>{task.is_completed ? "Done" : "Pending"}</span>
          <button onClick={() => {handleOpenModal(task)}}>Update</button>
          <button onClick={()=>{handleDelete(task.task_id)}}>Delete</button>
        </div>)
      })}

      {isEditModalOpen && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={selectedTask} />
      )}
    </div>
  )
}