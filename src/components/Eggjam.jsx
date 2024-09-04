import React, { useState, useEffect, useRef } from 'react';
import { scaleLinear } from 'd3-scale';
import newStartingLetters from '../../helpers/eggjamHelpers';


export default function Eggjam() {
    const [xPos, setX] = useState(0);
    const [yPos, setY] = useState(-75);
    const [letters, updateLetters] = useState(() => newStartingLetters(11));



    const width = 300;
    const height = 500;
    const xScale = scaleLinear([-100, 100], [0, width]);
    const yScale = scaleLinear([100, -100], [0, height]);

    let polyPoints = [
        [xScale(0 - xPos), yScale(-75)],
        [xScale(-5 - xPos), yScale(-85)],
        [xScale(5 - xPos),yScale(-85)]
    ]
    .map(([a,b]) => a.toString() + " " + b.toString())
    .join(',')




    return (

        <div className='App'>
          <div id='title'>Eggjam #23</div>
            <svg
                style = {{backgroundColor: '#D3D3D3'}}
                height = {height}
                width = {width}
            >
                <line x1={xScale(-60)} x2={xScale(-60)} y1={yScale(-100)} y2={yScale(100)} style={{stroke: 'darkgray', strokeWidth: 2 }} />
                <line x1={xScale(-30)} x2={xScale(-30)} y1={yScale(-100)} y2={yScale(100)} style={{stroke: 'darkgray', strokeWidth: 2 }} />
                <line x1={xScale(0)} x2={xScale(-0)} y1={yScale(-100)} y2={yScale(100)} style={{stroke: 'darkgray', strokeWidth: 2 }} />
                <line x1={xScale(30)} x2={xScale(30)} y1={yScale(-100)} y2={yScale(100)} style={{stroke: 'darkgray', strokeWidth: 2 }} />
                <line x1={xScale(60)} x2={xScale(60)} y1={yScale(-100)} y2={yScale(100)} style={{stroke: 'darkgray', strokeWidth: 2 }} />

                {letters.map(
                    d => <g>
                        <circle
                            cx= {xScale(d.x)}
                            cy={yScale(d.y)}
                            stroke='black'
                            fill='black'
                            r='12'
                        />
                        <text
                            x={xScale(d.x)}
                            y={yScale(d.y)}
                            fill='white'
                            textAnchor='middle'
                            dy="0.35em"
                        >{d.letter}</text>
                        </g>
                )}
                
                <polygon points={polyPoints} fill="white" stroke="black"/>
            

            </svg>
        </div>
    )
}