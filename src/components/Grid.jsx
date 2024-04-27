import React from 'react';
import Tile from './Tile';

export default function Grid( { board }) {
    return <div>
        <div></div>
    {board.map(x => <Tile letter={x}/>)}
    </div>
}