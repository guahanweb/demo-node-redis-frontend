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
        votes: {},
    });

    const handleTimerChange = useCallback(function (new_time: number) {
        setTimer(curr => {
            console.log("TIMER CHANGE:", curr, new_time);
            if (curr === null && new_time > 0) {
                // new game is starting, set the timer and the game status
                setStatus("active");
            } else if (curr !== null && new_time === 0) {
                // timer is expired, so finish game
                setStatus("complete");
            }
            return new_time;
        });
    }, []);

    // whenever the message changes, see what we need to do
    useEffect(function () {
        if (message !== null) {
            console.log(message);
            const { topic, data = null }: any = message;
            switch (topic) {
                case "state":
                    setStatus(data.status);
                    setRunning(data.running);
                    setTimer(data.countdown);
                    setVotes(data.votes);
                    break;

                case "timer":
                    handleTimerChange(data);
                    break;

                case "votes":
                    handleVoteChange(data);
                    break;
            }
        }
    }, [message]);

    const handleVoteChange = useCallback((data: any) => {
        const result: any = {};
        let total: number = 0;

        data.forEach(({ votes, choice }: { votes: number, choice: string }) => {
            result[choice] = votes;
            total += votes;
        });

        console.log("RECEIVED:", result);

        setVotes({
            votes: result,
            total,
        });
    }, []);

    return (
        <AppContext.Provider value={{
            // state variables
            status,
            running,
            timer,
            votes,

            // actions
            setVotes: handleVoteChange,
            setTimer: handleTimerChange,
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
