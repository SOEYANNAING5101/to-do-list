import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
// fetch player
export interface Player {
    player_id: string,
    name: string,
    goals: number,
    assists: number,
    created_at: string
}
 const fetchAllPlayer = async (): Promise<Player[]> => {
    try {
        const response = await fetch('http://localhost:4000/api/players', {
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
            console.error("Error fetching player details", error.message);
        } else {
            console.error("Error occurred.");
        }
        throw error;
    }
}
export const usePlayers = () =>{
    return useQuery({
        queryKey: ['players'],
        queryFn : fetchAllPlayer,
        retry: 1,
        staleTime : 1000 *60*5
    })
}

// add new player
type NewPlayer = Omit<Player, "created_at" | "player_id" >
export const useAddPlayer = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async(newPlayer:NewPlayer) =>{
            const response = await fetch ("http://localhost:4000/api/players",{
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body:JSON.stringify(newPlayer)
            });
            const data = await response.json();
            if (!response.ok){
                throw new Error (data.error || "Failed to save stats")
            }
            return data;
        },
        onSuccess: () =>{
            queryClient.invalidateQueries({queryKey:['players']});
            alert('Player stats saved successfully!')
        },
        onError: (error)=>{
            console.error("failed to add players: ",error.message);
            alert(`Error: ${error.message}`);
        }
    })
}

//edit player
type EditPlayer = Omit <Player, "created_at">
export const useEditPlayer = () =>{
    const queryClient = useQueryClient();
    return useMutation ({
        mutationFn: async(editPlayer:EditPlayer) =>{
            console.log("editPlayer",editPlayer)
            const response = await fetch (`http://localhost:4000/api/players/${editPlayer.player_id}`,{
                method: 'PUT',
                headers: {'Content-type': 'application/json'},
                body:JSON.stringify(editPlayer)
            });
            const data = await response.json();
            if (!response.ok){
                throw new Error (data.error || "Failed to update stats")
            }
            return data;
        },
        onSuccess: () =>{
            queryClient.invalidateQueries({queryKey:['players']})
            alert('Player stats updated successfully!')
        },
        onError: (error)=>{
            console.error("failed to update players: ",error.message);
            alert(`Error: ${error.message}`);
        }
    })
}

export const useDeletePlayer = (player_id: string) =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (playerId: string)  =>{
            const response = await fetch (`http://localhost:4000/api/players/${playerId}`,{
            method: 'DELETE',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(player_id)
        });
        const data  = await  response.json();
        if (!response.ok){
            throw new Error (data.error || "Failed to delete the player")
        }
        return data;
        },
        onSuccess: () =>{
            alert('Player deleted successfully.')
            queryClient.invalidateQueries({queryKey: ['players']});   
        },
        onError: (error)  =>{
            console.error("Failed to delete player",error.message);
            alert("Error deleting player")
        }
    })
}


