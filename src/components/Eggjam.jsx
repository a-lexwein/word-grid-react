import React, { useState, useEffect, useRef } from 'react';
import { scaleLinear } from 'd3-scale';
import { newStartingLetters, newRow, rowsInLetters } from '../../helpers/eggjamHelpers';
import wordInList from '../../helpers/wordInList';
import Scoreboard from './Scoreboard';
import './Eggjam.css';

export default function Eggjam() {
    const [xPos, setX] = useState(0);
    const xPosRef = useRef(xPos); // Ref to hold the current xPos
    const [yPos, setY] = useState(-75);
    const [letters, updateLetters] = useState(() => newStartingLetters(11));
    const [currentGuess, updateGuess] = useState('');
    const [hist, updateHist] = useState([]);
    const [timer, setTimer] = useState(15);
    const [last5seconds, setLast5Seconds] = useState(false);
    const [gameState, setGameState] = useState('post-game');
    const [letterCount, setLetterCount] = useState(4);
    const [tickY, setTickY] = useState(0.7);

    const [optionsModalOpen, setOptionsModalOpen] = useState(false);
    const optionsModalRef = useRef(null);

    // const getScore = (hist) => Math.sum(...hist.map(x=>x.score))

    // Function to increment the timer by 5 seconds
    const addTime = (s) => {
        setTimer(prevTimer => prevTimer + s);
    };

    const log = (word, hist) => {
        const output = {
            word,
            valid: wordInList(word),
            used: hist.some(h => h.word === word),
            score: wordInList(word) && !hist.some(h => h.word === word) ? 1 : 0
        };
        return output;
    };

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
        [xScale(-3 + xPosRef.current), yScale(yPos-8)],
        [xScale(-25 + xPosRef.current), yScale(yPos-15)],
        [xScale(-3 + xPosRef.current), yScale(yPos-15)],
        [xScale(-3 + xPosRef.current), yScale(yPos-20)],
        [xScale(-10 + xPosRef.current), yScale(yPos-23)],
        [xScale(10 + xPosRef.current), yScale(yPos-23)],
        [xScale(3 + xPosRef.current), yScale(yPos-20)],
        [xScale(3 + xPosRef.current), yScale(yPos-15)],
        [xScale(25 + xPosRef.current), yScale(yPos-15)],
        [xScale(3 + xPosRef.current), yScale(yPos-8)],
        [xScale(1 + xPosRef.current), yScale(yPos-3)],
        [xScale(-1 + xPosRef.current), yScale(yPos-3)],
        
    ])
    .map(([a, b]) => a.toString() + " " + b.toString())
    .join(',');

    // Game Loop for timer
    useEffect(() => {
        const interval = setInterval(() => {
            
            setTimer(prevTimer => {
                if (prevTimer > 0) {
                    if (prevTimer <= 5) setLast5Seconds(true);
                    return prevTimer - 1;
                } else {
                    
                    // clearInterval(interval);
                    setGameState('post-game');
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Game Loop for letters
    useEffect(() => {
        const interval = setInterval(() => {
            if (gameState != 'in-game') return;

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
                    let submission = log(newGuess, hist);
                    // increment timer by length of word...revisit.
                    if(submission.score > 0) addTime(submission.word.length);
                    updateHist(hist => ([...hist, submission]));
                    // setTickY(oldVal => oldVal + submission.score * 0.08);
                    updateGuess('');
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
    }, [currentGuess, gameState]); // don't think I need gameState here.

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

    const handleNewGame = () => {
        updateHist([]);
        updateGuess('');
        setTimer(45);
        // setTickY(0.7);
        updateLetters(newStartingLetters(11));
        setGameState('in-game');
    };

    const gameSVG = <svg
        ref={svgRef}
        style={{ backgroundColor: '#bccaeb' }}
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
                    fill='#f0f4ff'
                    r='15'
                />
                <text
                    x={xScale(d.x)}
                    y={yScale(d.y)}
                    fill='black'
                    textAnchor='middle'
                    dy="0.35em"
                    fontSize="1.5em"
                >
                    {d.letter}
                </text>
            </g>
        ))}
        <polygon points={getPolyPoints(xPos)} fill="#6a6b6c" stroke="black" />
    </svg>

    const menuButton = (x,y, text, callback) => {
    return <g
        onClick={callback}
        >
            <circle
                cx={xScale(x)}
                cy={yScale(y)}
                fill='#f0f4ff'
                r='15'
            />
            <text
                x={xScale(x)}
                y={yScale(y)}
                fill='black'
                textAnchor='middle'
                dy="0.35em"
                fontSize="1.5em"
            >
                {text}
            </text>
        </g>   
    }

    const menuSVG = <svg
        ref={svgRef}
        style={{ backgroundColor: '#bccaeb' }}
        height={height}
        width={width}
        >
            <text x={xScale(-90)} y={yScale(65)}>Word Length:</text>
            {menuButton(-60,50, '3', () => setLetterCount(3))}
            {menuButton(-30,50, '4', () => setLetterCount(4))}
            {menuButton(0,50, '5', () => setLetterCount(5))}
            {menuButton(30,50, '6', () => setLetterCount(6))}
            {menuButton(60,50, '7', () => setLetterCount(7))}

            <text x={xScale(-90)} y={yScale(25)}>Speed:</text>
            {menuButton(-60,15, '1', () => setTickY(0.7))}
            {menuButton(-30,15, '2', () => setTickY(1.1))}
            {menuButton(0,15, '3', () => setTickY(1.5))}
            {menuButton(30,15, '4', () => setTickY(2))}
            {menuButton(60,15, '🤢', () => console.log('hello'))}
            <g
                onClick={handleNewGame}
            >
            <rect
                x={xScale(-50)}
                width={width/2}
                y={yScale(-20)}
                height={height/10}
                fill="blue"
                rx="15"
            />
            <text
                x={xScale(-40)}
                y={yScale(-34)}
                fill='black'
                // textAnchor='middle'
                // dy="0.35em"
                fontSize="1.5em"
                fill = "white"
            >New Game</text>
            </g>

        <polygon points={getPolyPoints(xPos)} fill="#6a6b6c" stroke="black" />
    </svg>


    return (
        <div className='App'>
            <div id='title'>Eggjam #23: Air n' Spelling</div>
            { gameState === 'in-game' ? gameSVG : menuSVG}
            <div>{currentGuess}</div>
            <Scoreboard
                timer={timer}
                history={hist}
            />
            <div>
                {tickY} 
                Rules: Use arrow keys to move. Find as many 4-letter words as you can before the timer reaches zero. Each word found adds time and increases speed.
            </div>
        </div>
    );
}
