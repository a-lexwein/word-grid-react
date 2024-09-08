import React, { useState, useEffect, useRef } from 'react';
import { scaleLinear } from 'd3-scale';
import { newStartingLetters, newRow, rowsInLetters } from '../../helpers/eggjamHelpers';
import wordInList from '../../helpers/wordInList';
import Scoreboard from './Scoreboard';
const [gameState, setGameState] = useState('in-game');

import './Eggjam.css'


export default function Eggjam() {
    const [xPos, setX] = useState(0);
    const xPosRef = useRef(xPos); // Ref to hold the current xPos
    const [yPos, setY] = useState(-75);
    const [letters, updateLetters] = useState(() => newStartingLetters(11));
    const [currentGuess, updateGuess] = useState('');
    const [hist, updateHist] = useState([])

    const [timer, setTimer] = useState(30);
    const [last5seconds, setLast5Seconds] = useState(false);

    const letterCount = 4;

    const log = (word, hist) => {
        const output = {};
        output.word = word;
        output.valid = wordInList(word);
        output.used = hist.includes(word);
        // 1 for new words, 0 for wrong words, 0 for reused words
        output.score = wordInList(word) ? hist.includes(word) ? 0 : 1 : 0;
        return output;
    }

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

    const getPolyPoints = () => ([
        [xScale(0 + xPosRef.current), yScale(-75)],
        [xScale(-5 + xPosRef.current), yScale(-85)],
        [xScale(5 + xPosRef.current), yScale(-85)]
    ])
    .map(([a, b]) => a.toString() + " " + b.toString())
    .join(',');

    // Game Loop

    useEffect(() => {
        const interval = setInterval(() => {
          setTimer((prevTimer) => {
            if (prevTimer > 0) {
              if (prevTimer <= 5) setLast5Seconds(true)
              return prevTimer - 1;
            } else {
              clearInterval(interval);
            //   setGameState('post-game');
              return 0;
            }
          });
        }, 1000);
    
        return () => clearInterval(interval);
      }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const tickY =  0.7; // 1

            updateLetters(prevLetters => {
                let output = prevLetters;
                let newGuess = currentGuess;
                
                // Check for collisions
                for (const d of output) {
                    if (
                        d.x === xPosRef.current &&
                        d.selected === false &&
                        d.y - yPos >= 0 &&
                        d.y - yPos < tickY
                    ) {
                        d.selected = true;
                        newGuess += d.letter;
                        updateGuess(newGuess);
                    }
                }

                // If that completes a word, validate and reset currentWord
                if (newGuess.length === letterCount) {
                    updateHist(hist => ([...hist, log(newGuess, hist)]))
                    updateGuess('')

                }

                // Move letters
                output = output.map(letter => ({
                    ...letter,
                    y: letter.y - tickY,
                }));

                // Remove rows
                output = output.filter(letter => letter.y >= -101);

                // Replace removed rows
                if (rowsInLetters(output) < rowsInLetters(prevLetters)) {
                    output.push(...newRow(350));
                }

                return output;
            });

        }, 10);

        return () => clearInterval(interval);
    }, [currentGuess]);

    // Keyboard
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

    // swipe controls
    const svgRef = useRef(null);
    useEffect(() => {
        const svg = svgRef.current;
        let touchStartX = null;

        const handleTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
        };

        const handleTouchMove = (e) => {
            if (!touchStartX) return;

            const touchEndX = e.touches[0].clientX;
            const touchDiffX = touchStartX - touchEndX;

            if (touchDiffX > 30) {
                moveLeft();
                touchStartX = null; // Reset after handling swipe
            } else if (touchDiffX < -30) {
                moveRight();
                touchStartX = null; // Reset after handling swipe
            }
        };

        const handleTouchEnd = () => {
            touchStartX = null; // Reset after touch ends
        };

        if (svg) {
            svg.addEventListener('touchstart', handleTouchStart);
            svg.addEventListener('touchmove', handleTouchMove);
            svg.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (svg) {
                svg.removeEventListener('touchstart', handleTouchStart);
                svg.removeEventListener('touchmove', handleTouchMove);
                svg.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, []);

    return (
        <div className='App'>
            <div id='title'>Eggjam #23: Spell {letterCount}-letter Words</div>
            <svg
                ref={svgRef}
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
            <Scoreboard
                timer={timer}
                history={hist}
            />
        </div>
    );
}
