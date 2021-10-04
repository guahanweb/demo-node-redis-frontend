import React, { useState } from 'react';
import { useWebsocket } from "hooks/withWebsocket"
import { useAppState } from "hooks/withAppState"

export function AdminPanel() {
    const { status } = useAppState();

    return (
        <ControlPanel status={status} />
    )
}

function ControlPanel({ status }: any) {
    const { send } = useWebsocket();
    console.log(status);

    return (
        <div className="controls">
            <button onClick={() => send({ action: "start" })} disabled={status !== "pending"}>start</button>
            <button onClick={() => send({ action: "stop" })} disabled={status !== "running"}>stop</button>
            <button onClick={() => send({ action: "reset" })} disabled={status !== "complete"}>reset</button>
        </div>
    )
}
