import { useState, useEffect } from 'react'
import { type Player } from '../AddNewListPage'
import { useQueryClient } from '@tanstack/react-query'
import {useEditPlayer} from '../hooks/usePlayers'

interface EditPlayerModalProps {
    isOpen: boolean,
    onClose: () => void,
    player: Player | null
}


const EditPlayerModal = ({ isOpen, onClose, player }: EditPlayerModalProps) => {
    const [goals, setGoals] = useState<number>(0);
    const [assists, setAssists] = useState<number>(0);
    const queryClient = useQueryClient();
    const updatePlayerMutation = useEditPlayer();

    useEffect(() => {
        if (player) {
            setGoals(player.goals)
            setAssists(player.assists)
        }
    }, [player])
    // edit api call
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedData = {
            player_id: player.player_id,
            name: player.name,
            goals: goals,
            assists: assists
        }
        updatePlayerMutation.mutate(updatedData,{
            onSuccess : () =>{
                onClose();
            }
        })
    }
    return (
        <div className='fixed bg-black/80 inset-0 left-0 top-0 bottom-0 right-0 flex items-center justify-center z-40'>
            <div
                className='bg-white p-4 flex flex-col items-center justify-center'
            >
                <div className='flex w-full items-center justify-between'>
                    <span>Edit Modal</span>
                    <button onClick={() => onClose()}>X</button>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                    {/* Name */}
                    <div className='flex  items-center gap-2'>
                        <label>Name</label>
                        <div className='p-2'>
                            {player && player.name}
                        </div>
                    </div>
                    {/* Goals */}
                    <div className='flex  items-center gap-2'>
                        <label>Goals</label>
                        <input
                            className='border p-2'
                            type="number"
                            min="0"
                            onChange={(e) => setGoals(Number(e.target.value))}
                            value={goals}
                        >
                        </input>
                    </div>
                    {/* Assists */}
                    <div className='flex items-center gap-2'>
                        <label>Assists</label>
                        <input
                            className='border p-2'
                            type="number"
                            min="0"
                            onChange={(e) => setAssists(Number(e.target.value))}
                            value={assists}
                        >
                        </input>
                    </div>
                    <button className='border p-4 hover:bg-gray-200 cursor-pointer' type='submit'>Edit Player</button>

                </form>
            </div>

        </div>
    )

}
