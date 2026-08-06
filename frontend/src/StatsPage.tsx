import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { usePlayers } from "./hooks/usePlayers";

export default function StatsPage (){
    const { data: players = [], isLoading, isError } = usePlayers();

    return (
        <div>
            {players.map((player) => (
                <div key={player.player_id} className="flex gap-3">
                    <span>{player.player_id}</span>
                    <span>{player.name}</span>
                    <span>{player.goals}</span>
                    <span>{player.assists}</span>
    
                </div>
            ))}
        </div>
    )


}