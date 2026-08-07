import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

export interface Task {
    task_id: string,
    title: string,
    description: string,
    is_completed: boolean,
    created_at: string
}
const baseurl = import.meta.env.VITE_API_URL;
const fetchAllTasks = async (): Promise<Task[]> => {
    try {
        const response = await fetch(`${baseurl}/api/tasks`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching task lists", error.message);
        } else {
            console.error("Error occurred.");
        }
    }
}
export const useGetTasks = () => {
    return useQuery({
        queryKey: ['tasks'],
        queryFn: fetchAllTasks,
        retry: 1,
        staleTime: 1000 * 60 * 5
    })
}

type NewTask = Omit<Task, "task_id" | "created_at">
export const useAddTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTask: NewTask) => {
            const response = await fetch(`${baseurl}/api/tasks`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(newTask)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to save new task")
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            alert('New task saved successfully!')
        },
        onError: (error) => {
            console.error("failed to save new tasks: ", error.message);
            alert(`Error: ${error.message}`);
        }
    })
}

export interface UpdateTask {
    task_id: string;
    title?:string;
    description?:string;
    is_completed?:boolean;
};
export const useEditTask = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedTask:UpdateTask) =>{
            const response = await fetch(`${baseurl}/api/tasks/${updatedTask.task_id}`,{
                method: 'PUT',
                headers: {'content-type':'application/json'},
                body:JSON.stringify(updatedTask)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to update task");
            }
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:['tasks']})
            alert('Updated')
        },
        onError: (error) =>{
            console.error("Failed to update task",error.message);
            alert('Error updating.')
        }
    })
}

export const useDeleteTask = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async(task_id:string) =>{
            const response = await fetch(`${baseurl}/api/tasks/${task_id}`,{
                method: 'DELETE',
                headers: {'content-type':'application/json'},
            });
            const data = response .json();
            if(!response.ok){
                throw new Error("data.error || 'Error deleting task")
            }
            return data;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:['tasks']});
            alert('Task deleted')
        },
        onError: () =>{
            alert("Error deleting task")
        }
        
    }
    )

}