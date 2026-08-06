// import { useState } from "react"
// import EditPlayerModal from "./modal/EditPlayerModal"
// import { useQueryClient } from "@tanstack/react-query";
// import { usePlayers, type Player, useAddPlayer, useDeletePlayer } from './hooks/usePlayers'
// interface PlayerFormData {
//   name: string,
//   goals: number,
//   assists: number
// }

// export default function App() {

//   const [formData, setFormData] = useState<PlayerFormData>({
//     name: "",
//     goals: 0,
//     assists: 0
//   })

//   const { data: players = [], isLoading, isError } = usePlayers();
//   const addPlayerMutation = useAddPlayer();
//   const deletePlayerMutation = useDeletePlayer();

//   // Edit Player Modal
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
//   const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "number" ? Number(value) : value
//     }))
//   }
//   const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     addPlayerMutation.mutate(formData, {
//       onSuccess: () => {
//         setFormData({ name: "", goals: 0, assists: 0 })
//       }
//     })
//   }

//   // Edit modal on/off
//   const handleOpenModal = (player: Player) => {
//     setIsModalOpen(true);
//     setSelectedPlayer(player)
//   }

//   // Delete player
//   const handleDelete = (playerId: string) => {
//     const confirmDelete = window.confirm("Are you sure?")
//     if (!confirmDelete) return;
//     deletePlayerMutation.mutate(playerId)
//   }

//   if (isLoading) return <div className="p-4">Loading players...</div>;
//   if (isError) return <div className="p-4 text-red-500">Error loading players!</div>;
//   return (
//     <div className=" p-2 font-semibold">
//       <h1>Mavericks Interview</h1>
//       <p>Frontend is connected and ready.</p>
//       <form
//         onSubmit={handleSubmit}
//         className="p-6 border bg-red-200"
//       >
//         <div className="flex flex-col">
//           <label>Playername</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="p-2 rounded bg-slate-700 text-white focus:outline-none foucs:ring-2 focus:ring-blue-500"
//             required />
//         </div>
//         <div className="flex flex-col">
//           <label>Goals</label>
//           <input
//             type="number"
//             name="goals"
//             value={formData.goals}
//             onChange={handleChange}
//             className="p-2 rounded bg-slate-700 text-white focus:outline-none foucs:ring-2 focus:ring-blue-500"
//             required></input>
//         </div>
//         <div className="flex flex-col mb-4">
//           <label>Assists</label>
//           <input
//             type="number"
//             name="assists"
//             value={formData.assists}
//             onChange={handleChange}
//             className="p-2 rounded bg-slate-700 text-white focus:outline-none foucs:ring-2 focus:ring-blue-500"
//             required></input>
//         </div>

//         <button type="submit"
//           className="p-2 rounded bg-slate-700 hover:bg-slate-800 hover:text-white/80 cursor-pointer text-white" >Add Player</button>
//       </form>

//       <div>
//         <h1>Player list</h1>
//         {players.length === 0 ? (
//           <div>No player found</div>
//         ) : (
//           <div>
//             {players.map((player) => (
//               <div className="flex gap-3">
//                 <span>{player.player_id}</span>
//                 <span>{player.name}</span>
//                 <span>{player.goals}</span>
//                 <span>{player.assists}</span>
//                 <button onClick={() => handleOpenModal(player)}>Update</button>
//                 <button onClick={() => { handleDelete(player.player_id) }}>Delete</button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       {isModalOpen && (
//         <EditPlayerModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           player={selectedPlayer}
//         />
//       )}

//     </div>
//   )
// }
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

