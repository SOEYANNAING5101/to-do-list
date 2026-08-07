import {useAddTask} from './hooks/useTask'
import {useState} from 'react'


export default function App() {
  const addTaskMutation = useAddTask();
  const [title,setTitle] =useState<string>('')
  const [description,setDescription] =useState<string>('');

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) =>{
    e.preventDefault();
    addTaskMutation.mutate(
      {title,description,is_completed:false},
      {
        onSuccess: ()=>{
          setTitle("");
          setDescription("")
        }
      }
    )
    
  }

  return (
    <div>
      
      <form onSubmit={handleSubmit} className='border flex flex-col items-center justify-center gap-6'>
        <h1 >To do list</h1>
        <div className='flex items-center justify-center gap-4 '>
          <label>Task title</label>
          <input
          type='text'
          onChange={(e)=>setTitle(e.target.value)}
          className='p-3 border '
          required>
          </input>
        </div>
        <div className='flex items-center justify-center gap-4'>
          <label>Description</label>
          <textarea
          onChange={(e)=>setDescription(e.target.value)}
          className='p-3 border '
          >
          </textarea>
        </div>
        <button type='submit' disabled={addTaskMutation.isPending} className='bg-blue-500 p-4 text-gray-200'>
          {addTaskMutation.isPending ? "Loading" : "Submit"}
        </button>

      </form>
    </div>
  )
   

}

