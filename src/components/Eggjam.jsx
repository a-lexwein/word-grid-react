import React, { useState, useEffect, useRef } from 'react';
import { scaleLinear } from 'd3-scale';
import { newStartingLetters, newRow } from '../../helpers/eggjamHelpers';

export default function Eggjam() {
    const [xPos, setX] = useState(0);
    const xPosRef = useRef(xPos); // Ref to hold the current xPos
    const [yPos, setY] = useState(-75);
    const [letters, updateLetters] = useState(() => newStartingLetters(11));
    const [currentGuess, updateGuess] = useState('');

    const moveLeft = () => {
        setX(prevXpos => {
            const newXpos = Math.max(prevXpos - 30, -60);
            xPosRef.current = newXpos; // Update the ref with the new value
            return newXpos;
        });
    };

    const moveRight = () => {
        setX(prevXpos => {
            const newXpos = Math.min(prevXpos + 30, 60);
            xPosRef.current = newXpos; // Update the ref with the new value
            return newXpos;
        });
    };

    const width = 300;
    const height = 500;
    const xScale = scaleLinear([-100, 100], [0, width]);
    const yScale = scaleLinear([100, -100], [0, height]);

    const getPolyPoints = (xPos) => ([
        [xScale(0 + xPosRef.current), yScale(-75)],
        [xScale(-5 + xPosRef.current), yScale(-85)],
        [xScale(5 + xPosRef.current), yScale(-85)]
    ])
    .map(([a, b]) => a.toString() + " " + b.toString())
    .join(',');

    // Game Loop
    useEffect(() => {
        const interval = setInterval(() => {
            const tickY = 0.6;

            updateLetters(prevLetters => {
                let output = prevLetters;
                
                // Check for collisions
                for (const d of output) {
                    if (
                        d.x === xPosRef.current &&
                        d.selected === false &&
                        d.y - yPos >= 0 &&
                        d.y - yPos < tickY
                    ) {
                        d.selected = true;
                        updateGuess(prevGuess => prevGuess + d.letter);
                    }
                }

                // Move letters
                output = output.map(letter => ({
                    ...letter,
                    y: letter.y - tickY,
                }));

                // Remove rows
                output = output.filter(letter => letter.y >= -101);

                // Replace removed rows
                if (output.length < prevLetters.length) {
                    output.push(...newRow(350));
                }

                return output;
            });

        }, 10);

        return () => clearInterval(interval);
    }, []);

    // Controls
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                moveLeft();
            } else if (event.key === 'ArrowRight') {
                moveRight();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className='App'>
            <div id='title'>Eggjam #23</div>
            <svg
                style={{ backgroundColor: '#D3D3D3' }}
                height={height}
                width={width}
            >
                <line x1={xScale(-60)} x2={xScale(-60)} y1={yScale(-100)} y2={yScale(100)} style={{ stroke: 'darkgray', strokeWidth: 2 }} />
                <line x1={xScale(-30)} x2={xScale(-30)} y1={yScale(-100)} y2={yScale(100)} style={{ stroke: 'darkgray', strokeWidth: 2 }} />
                <line x1={xScale(0)} x2={xScale(0)} y1={yScale(-100)} y2={yScale(100)} style={{ stroke: 'darkgray', strokeWidth: 2 }} />
                <line x1={xScale(30)} x2={xScale(30)} y1={yScale(-100)} y2={yScale(100)} style={{ stroke: 'darkgray', strokeWidth: 2 }} />
                <line x1={xScale(60)} x2={xScale(60)} y1={yScale(-100)} y2={yScale(100)} style={{ stroke: 'darkgray', strokeWidth: 2 }} />

                {letters.map((d) => (
                    <g key={d.index}>
                        <circle
                            cx={xScale(d.x)}
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
                        >
                            {d.letter}
                        </text>
                    </g>
                ))}

                <polygon points={getPolyPoints(xPos)} fill="white" stroke="black" />
            </svg>
            <div>{currentGuess}</div>
        </div>
    );
}
