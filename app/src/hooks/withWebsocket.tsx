import { createContext, useRef, useState, useEffect, useCallback, useContext } from "react";

interface WebsocketState {
    message: object|null
    send: Function
}

const WebsocketContext = createContext<WebsocketState>({
    message: null,
    send: () => {},
});

export function WebsocketProvider({ address, children }: { address: string, children: JSX.Element }) {
    const ws: any = useRef(null);
    const [ message, setMessage ] = useState(null);

    useEffect(function () {
        ws.current = new WebSocket(address);
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");

        // handle messages
        ws.current.onmessage = (e: any) => {
            try {
                const message = JSON.parse(e.data);
                setMessage(message);
            } catch (err) {
                // unknown message
            }
        }

        return () => {
            ws.current.close();
        }
    // eslint-disable-next-line
    }, []);

    const send = useCallback(function (cmd) {
        if (!ws.current) return;
        const message = `c::${JSON.stringify(cmd)}`;
        ws.current.send(message);
    }, []);

    return (
        <WebsocketContext.Provider value={{ message, send }}>
            {children}
        </WebsocketContext.Provider>
    )
}

export function useWebsocket() {
    const context = useContext(WebsocketContext);
    if (context === undefined) {
        throw new Error("useWebsocket() must be called from within a WebsocketProvider context");
    }
    return context;
}
