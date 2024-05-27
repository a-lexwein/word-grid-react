import React from 'react';

export default function Tile({ letter, id, handleClick, data, currentGuess }) {
  let tile = data.filter(x=> x.id === id)[0]
  let max_selected = Math.max(...data.map(x=> x.selected_order)) || 0

  let backgroundColor = tile.letter === '_' ? 'black' : 'white'
  if(tile.clicked) backgroundColor = '#e6d69e'

  const handlePointerEnter = (e) => {
    if(e.buttons !== 0 && currentGuess !== '') handleClick()
  }
  
  return (
    <div
      id={id}
      className="tile"
      style={{ backgroundColor: backgroundColor }}
      onPointerDown={handleClick}
    >
      <div className="tileText">{letter}</div>
      <div
          className="hitbox"
          onPointerDown={handleClick}
          onPointerEnter={handlePointerEnter}
        />
      </div>
  );
}
