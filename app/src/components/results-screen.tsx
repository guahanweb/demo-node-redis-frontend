import React, { useEffect, useState } from 'react';
import { useWebsocket } from "hooks/withWebsocket"
import { useAppState } from "hooks/withAppState"

export function ResultsScreen({ options }: any) {
    const { votes } = useAppState();

    const [ voteResults, setVoteResults ] = useState<any[]>([]);

    useEffect(function () {
        const results = options.map((choice: string) => {
            const value = votes.votes && votes.votes[choice];
            return {
                choice,
                votes: value || 0,
            };
        });
        setVoteResults(results);
    }, [votes, options]);

    return (
        <div className="screen-wrapper results-screen">
            <header>
                <h1>All done!</h1>
                <ul>
                    {voteResults.map((k, i) => {
                        return <li key={`vote-${i}`}>{k.choice}: {k.votes}</li>
                    })}
                </ul>
            </header>
        </div>
    )
}
