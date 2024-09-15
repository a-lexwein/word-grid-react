import React, { useState, useEffect, useRef } from 'react';
import { scaleLinear } from 'd3-scale';
import { newStartingLetters, newRow, rowsInLetters } from '../../helpers/eggjamHelpers';
import wordInList from '../../helpers/wordInList';
// import Scoreboard from './Scoreboard';
import './Eggjam.css';

export default function Eggjam() {
    const [xPos, setX] = useState(0);
    const xPosRef = useRef(xPos); // Ref to hold the current xPos
    const [yPos, setY] = useState(-75);
    const [letters, updateLetters] = useState(() => newStartingLetters(11));
    const [currentGuess, updateGuess] = useState('');
    const [hist, updateHist] = useState([]);
    const [timer, setTimer] = useState(0);
    const [last5seconds, setLast5Seconds] = useState(false);
    const [gameState, setGameState] = useState('post-game');
    const [letterCount, setLetterCount] = useState(4);
    const [tickY, setTickY] = useState(0.6);
    const [endGameMessage, setEndGameMessage] = useState('')
    const [gameHasBeenStarted, setGameHasBeenStarted] = useState(false)

    const [optionsModalOpen, setOptionsModalOpen] = useState(false);
    const optionsModalRef = useRef(null);

    const displayCurrentGuess = () => {
        let output = currentGuess;
        while (output.length < letterCount) {
            output += '_'
        }
        return output
            .split('')
            .join(' ')
    }

    // const getScore = (hist) => Math.sum(...hist.map(x=>x.score))

    // Function to increment the timer by 5 seconds
    const addTime = (wordLength) => {
        let bonusMap = {
            3: 1,
            4: 3,
            5: 5,
            6: 8,
            7: 11,
        }
        
        // [
        //  [3,4,5,6,7],
        //  [1,3,5,8,10]
        // ]
        setTimer(prevTimer => prevTimer + bonusMap[wordLength]);
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
                    setEndGameMessage(gameHasBeenStarted ? `You scored ${hist.map(x => x.score).reduce((x,y) => x + y, 0)} points` :'');
                    
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [gameHasBeenStarted, hist]);

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
        setTimer(30);
        updateLetters(newStartingLetters(11));
        setGameState('in-game');
        setGameHasBeenStarted(true);
    };

    const svgStyle = {
        backgroundColor: '#bccaeb',
        touchAction: 'none',
        userSelect: 'none',
        fontFamily: 'monospace'
    }


    const gameSVG = <svg
        ref={svgRef}
        style={svgStyle}
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

        <rect
                x={0}
                width={width}
                y={0}
                height={height/9}
                fill="gray"

            />
        <text x={xScale(-40)} y={height/12} fill='black' fontSize="2em">
            {displayCurrentGuess()}
        </text>
        <text x={xScale(-90)} y={yScale(92)} fill='black' fontSize="1.3em">
            &#128337;{timer}
        </text>
        <text x={xScale(-90)} y={yScale(82)} fill='black' fontSize="1.3em">
            &#127775;{hist.map(x => x.score).reduce((x,y) => x + y, 0)}
        </text>
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


    const speedMap = {
        0.6: '1',
        1: '2',
        1.4: '3',
        2: '🤢',
        2.5: '🤮'
    }
    const menuSVG = <svg
        ref={svgRef}
        style= {svgStyle}
        height={height}
        width={width}
        >
            <text x={xScale(-90)} y={yScale(55)} style={{fontSize: "1.2em"}}>Word Length: {letterCount}</text>
            {menuButton(-60,40, '3', () => setLetterCount(3))}
            {menuButton(-30,40, '4', () => setLetterCount(4))}
            {menuButton(0,40, '5', () => setLetterCount(5))}
            {menuButton(30,40, '6', () => setLetterCount(6))}
            {menuButton(60,40, '7', () => setLetterCount(7))}

            <text x={xScale(-90)} y={yScale(15)} style={{fontSize: "1.2em"}}>Speed: {speedMap[tickY]}</text>
            {menuButton(-60,5, '1', () => setTickY(0.6))}
            {menuButton(-30,5, '2', () => setTickY(1))}
            {menuButton(0,5, '3', () => setTickY(1.4))}
            {menuButton(30,5, '🤢', () => setTickY(2))}
            {menuButton(60,5, '🤮', () => setTickY(2.5))}
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
                x={xScale(0)}
                y={yScale(-30)}
                textAnchor='middle'
                dy="0.35em"
                fontSize="1.5em"
                fill = "white"
            >New Game</text>
            </g>

            <text
                x={xScale(0)}
                y={yScale(-60)}
                textAnchor='middle'
                dy="0.35em"
                fontSize="1.5em"
                fill = "#6d6755"
            >{endGameMessage}</text>

        <polygon points={getPolyPoints(xPos)} fill="#6d6755" stroke="black" />
    </svg>


    return (
        <div className='App'>
            <div id='title'>Eggjam #23: Air n' Spelling</div>
            { gameState === 'in-game' ? gameSVG : menuSVG}
            <div>
                Rules: Use arrow keys to move. Find {letterCount}-letter words to increase the timer.
            </div>
        </div>
    );
}
