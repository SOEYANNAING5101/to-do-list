import { useState, useEffect } from 'react';
import { type UpdateTask, useEditTask } from '../hooks/useTask';

interface EditTaskModalProps {
    isOpen: boolean,
    onClose: () => void,
    task: UpdateTask | null
}
export default function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
    const editTaskMutation = useEditTask();
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [isCompleted, setIsCompleted] = useState<boolean>(false)

    useEffect(() => {
        if (task) {
            setTitle(task.title || "")
            setDescription(task.description || "")
            setIsCompleted(task.is_completed || false)
        }
    }, [task])
    console.log('title', title)
    console.log('description', description)
    console.log('isCompleted', isCompleted)
    if (!isOpen || !task) return null;
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        editTaskMutation.mutate({
            task_id: task.task_id,
            title,
            description,
            is_completed: isCompleted
        })
        console.log('Ready to submit to backend:', { title, description, isCompleted });
        onClose();
    }
    return (
        <div className='fixed left-0 right-0 top-0 bottom-0 bg-black/60 flex items-center justify-center' onClick={onClose}>
            <div className='bg-white p-6' onClick={(e) => e.stopPropagation()}>
                <h1>Edit Task</h1>
                <form onSubmit={handleSubmit}>
                    <div className='flex items-center justify-center gap-4 '>
                        <label>Task title</label>
                        <input
                            type='text'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className='p-3 border '
                            required>
                        </input>
                    </div>
                    <div className='flex items-center justify-center gap-4'>
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className='p-3 border '
                        >
                        </textarea>
                    </div>
                    <div className='flex items-center justify-center gap-4'>

                        <input
                            type='checkbox'
                            checked={isCompleted}
                            onChange={(e) => setIsCompleted(e.target.checked)}
                            className='p-3 border '
                        >
                        </input>
                        <label>Mark as completed</label>
                    </div>
                    <button type='submit'>
                        Update
                    </button>
                </form>

            </div>
        </div>
    )
}
