import React, { useEffect, useState, useCallback } from 'react';
import { useWebsocket } from "hooks/withWebsocket"
import { useAppState } from "hooks/withAppState"

export function GameScreen({ options }: any) {
    const { votes, timer } = useAppState();
    const [ voteCount, setVoteCount ] = useState(0);
    const [ scores, setScores ] = useState<any>({});

    useEffect(function () {
        // calculate data
        let total = 0;
        let summary: any = {};

        // prime with options
        options.forEach((opt: any) => summary[opt] = 0);

        if (votes && votes.length) {
            votes.forEach((vote: { choice: string, votes: number }) => {
                // only count the votes we recognize
                if (options.includes(vote.choice)) {
                    total += vote.votes;
                    summary[vote.choice] = vote.votes;
                }
            });
        }

        // set it up
        setVoteCount(total);
        setScores(summary);
    }, [votes, options]);
    
    return (
        <div className="screen-wrapper game-screen">
            <div className="game-options">
                {Object.keys(scores).map((choice: string, i: number) => {
                    let score: any = scores[choice];
                    return (
                        <VotingOption key={i}
                            choice={choice}
                            votes={score}
                            pct={Math.round((score / voteCount) * 100)}
                        />
                    )
                })}
            </div>
            <CountdownTimer timer={timer} />
        </div>
    )
}

function CountdownTimer({ timer }: any) {
    return timer === null ? null : (
        <div className="countdown">
            Game ends in: {timer} seconds!
        </div>
    );
}

function VotingOption({ choice, votes, pct }: { choice: string, votes: number, pct: number }) {
    const { send } = useWebsocket();

    const vote = useCallback(function (choice) {
        send({
            action: "vote",
            info: choice,
        });
    }, []);

    const images: any = {
        "eevee": "/img/Char-Eevee.png",
        "koffing": "/img/Char-Koffing.png",
        "pikachu": "/img/Char-Pikachu.png",
        "snorlax": "/img/Char-Snorlax.png",
    };

    return (
        <div className={`option option-${choice}`}>
            <div className="holder" onClick={() => vote(choice)} style={{ backgroundImage: `url(${images[choice]}`}}>
                <h1>{choice}</h1>
            </div>
        </div>
    )
}
