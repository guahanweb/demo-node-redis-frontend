import React, { useEffect, useState } from 'react';
import { useWebsocket } from "hooks/withWebsocket"
import { useAppState } from "hooks/withAppState"

export function SplashScreen() {
    const { send } = useWebsocket();

    return (
        <div className="screen-wrapper splash-screen">
            <header>
                <h1>Waiting to start...</h1>
                <p>
                    Your game will start shortly. Feel free to grab a coffee and
                    prepare to vote for your favorite Pokemon!
                </p>
            </header>
        </div>
    )
}
