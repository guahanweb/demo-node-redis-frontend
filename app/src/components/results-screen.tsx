import React, { useEffect, useState } from 'react';
import { useWebsocket } from "hooks/withWebsocket"
import { useAppState } from "hooks/withAppState"

export function ResultsScreen({ options }: any) {
    const { votes } = useAppState();

    const [ voteResults, setVoteResults ] = useState<any[]>([]);

    useEffect(function () {
        if (votes) {
            let total = 0;
            let results: any[] = [];

            votes.forEach((vote: any) => {
                if (options.includes(vote.choice)) {
                    total += vote.votes;
                    results.push({
                        choice: vote.choice,
                        votes: vote.votes,
                    });
                }
            });

            setVoteResults(results);
        }
    }, [votes]);

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
