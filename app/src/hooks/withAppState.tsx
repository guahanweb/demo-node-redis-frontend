import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { useWebsocket } from "./withWebsocket";

interface ScoreResults {
    total: number
    votes: object
}

interface ApplicationState {
    status: string
    running: boolean
    timer: number|null
    votes: any
    setVotes?: Function
    setTimer?: Function
}

const initialState: ApplicationState = {
    status: "pending", // waiting for startup
    running: false, // not running by default
    timer: null, // null timer until we start
    votes: {}, // empty votes to start with
};

const AppContext = createContext<ApplicationState>(initialState);

export function AppProvider({ children }: { children: JSX.Element }) {
    const { message } = useWebsocket();

    const [ status, setStatus ] = useState("pending");
    const [ running, setRunning ] = useState(false);
    const [ timer, setTimer ] = useState<number|null>(null);
    const [ votes, setVotes ] = useState<ScoreResults>({
        total: 0,
        votes: [],
    });

    const handleVoteChange = useCallback((data: any) => {
        const result: any = {};
        let total: number = 0;

        data.forEach(({ votes, choice }: { votes: number, choice: string }) => {
            result[choice] = votes;
            total += votes;
        });

        setVotes({
            votes: result,
            total,
        });
    }, []);

    // whenever the message changes, see what we need to do
    useEffect(function () {
        if (message !== null) {
            const { topic, data = null }: any = message;
            switch (topic) {
                case "state":
                    console.log("state data", data);
                    setStatus(data.status);
                    setRunning(data.running);
                    setTimer(data.countdown);
                    handleVoteChange(data.votes);
                    break;

                case "timer":
                    setTimer(data);
                    break;

                case "votes":
                    console.log("vote data:", data);
                    handleVoteChange(data);
                    break;
            }
        }
    }, [message, handleVoteChange]);

    return (
        <AppContext.Provider value={{
            // state variables
            status,
            running,
            timer,
            votes,
        }}>
            {children}
        </AppContext.Provider>
    )

}

export function useAppState() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppState() must be called from within a AppProvider context");
    }
    return context;
}
