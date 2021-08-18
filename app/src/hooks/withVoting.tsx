import { createContext, useRef, useState, useEffect, useCallback, useContext } from "react";

const VotingContext: any = createContext(null);
const ResultsContext: any = createContext(null);

export function VotingProvider({ address, children }: { address: string, children: JSX.Element }) {
    const ws: any = useRef(null);
    const [ votes, setVotes ] = useState(null);

    useEffect(function () {
        ws.current = new WebSocket(address);
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");

        // handle messages
        ws.current.onmessage = (e: any) => {
            try {
                const { topic, data } = JSON.parse(e.data);
                if (topic === "votes") {
                    setVotes(function () {
                        const result: any = {};
                        data.forEach(({ votes, choice }: any) => {
                            result[choice] = votes;
                        });
                        return result;
                    });
                }
            } catch (err) {
                // unknown message
            }
        }

        return () => {
            ws.current.close();
        }
    // eslint-disable-next-line
    }, []);

    const sendVote = useCallback(function (choice) {
        if (!ws.current) return;

        const payload = { action: "vote", info: choice };
        const message = `c::${JSON.stringify(payload)}`;
        ws.current.send(message);
    }, []);

    return (
        <VotingContext.Provider value={{ vote: sendVote }}>
            <ResultsContext.Provider value={votes}>
                {children}
            </ResultsContext.Provider>
        </VotingContext.Provider>
    )
}

export function useVoting() {
    const context = useContext(VotingContext);
    if (context === undefined) {
        throw new Error("useVoting() must be called from within a VotingProvider context");
    }
    return context;
}

export function useVotingResults() {
    const context = useContext(ResultsContext);
    if (context === undefined) {
        throw new Error("useVotingResults() must be called from within a VotingProvider context");
    }
    return context;
}
