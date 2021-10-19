import React, { useState, useRef, useEffect } from 'react';
import { useWebsocket } from "hooks/withWebsocket"
import { useAppState } from "hooks/withAppState"
import * as d3 from "d3"

interface AdminPanelProps {
    options: string[]
}

export function AdminPanel({ options }: AdminPanelProps) {
    const { status, votes } = useAppState();
    const [data, setData] = useState<number[]>([]);

    useEffect(function () {
        const results = options.map((choice: string) => {
            const value = votes.votes && votes.votes[choice];
            return value || 0;
        });
        setData(results);
    }, [votes, options]);

    return (
        <div className="admin">
            <ControlPanel status={status} />
            <div className="results">
                <BarChart width={480} height={600} data={data} />
            </div>
        </div>
    )
}

function ControlPanel({ status }: any) {
    const { send } = useWebsocket();

    return (
        <div className="controls">
            <button className="btn btn-light" onClick={() => send({ action: "start" })} disabled={status !== "pending"}>start</button>
            <button className="btn btn-light" onClick={() => send({ action: "stop" })} disabled={status !== "running"}>stop</button>
            <button className="btn btn-light" onClick={() => send({ action: "reset" })} disabled={status !== "complete"}>reset</button>
        </div>
    )
}

function BarChart({ width, height, data }: any) {
    const ref = useRef(null);

    useEffect(function () {
        d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
    }, [height, width]);

    useEffect(function () {
        draw();
    // eslint-disable-next-line
    }, [data]);

    function draw() {
        const svg = d3.select(ref.current);

        let domain: any = [0, d3.max(data)];

        let bars = svg.selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("class", "bar")
            .attr("x", (d: any, i: number) => i * 45)
            .attr("y", 0)
            .attr("height", height)

        let selection = svg.selectAll("rect")
            .data(data);

        // update all the text values
        svg.selectAll("text")
            .data(data)
            .each(function (d: any, i: number) {
                d3.select(this).text(d);
            });

        let yScale: any = d3.scaleLinear()
            .domain(domain)
            .range([0, height - 100]);

        bars.append("rect")
            .attr("x", (d: any, i: number) => {
                return (i * 45) + 5
            })
            .attr("y", (d: any) => height)
            .attr("width", 40)
            .attr("height", 0)
            .attr("fill", "orange")
            .transition().duration(300)
                .attr("height", (d: any) => yScale(d))
                .attr("y", (d: any) => height - yScale(d))

        bars.append("text")
            .text((d: any) => d)
            .attr("y", (d: any) => height - 20)
            .attr("x", (d: any, i: number) => (i * 45) + 25)
            .style("text-anchor", "middle");

        selection
            .transition().duration(300)
                .attr("height", (d: any) => yScale(d))
                .attr("y", (d: any) => height - yScale(d))

        selection
            .exit()
            .transition().duration(300)
                .attr("y", (d: any) => height)
                .attr("height", 0)
            .remove();
    }

    return (
        <div className="chart">
            <svg ref={ref}></svg>
        </div>
    )
}