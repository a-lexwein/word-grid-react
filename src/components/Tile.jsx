import React from 'react';

export default function Tile({ id, handleClick, handleTap, data, currentGuess, last5Seconds }) {
  let tile = data.filter(x=> x.id === id)[0]
  let max_selected = Math.max(...data.map(x=> x.selected_order)) || 0

  let backgroundColor = tile.letter === '_' ? 'black' : 'white'
  if(tile.clicked) backgroundColor = '#e6d69e'

  const handlePointerEnter = (e) => {
    e.target.releasePointerCapture(e.pointerId)

    if(e.pointerType === 'mouse' && e.buttons !== 0 && currentGuess !== '') handleClick()
    if(e.pointerType === 'touch' && currentGuess !== '') handleClick()
  }
  const tileClass = last5Seconds ? 'tile-last5Seconds' : 'tile'

  const div  = (
    <div
      id={id}
      className={tileClass}
      style={{ backgroundColor: backgroundColor }}
      onPointerDown={handleTap}
    >
      <div className="tile-text">{tile.letter}</div>
      <div className="tile-points">{tile.point_value}</div>
      <div
          className="hitbox"
          onPointerEnter={handlePointerEnter}
          onGotPointerCapture={e => e.target.releasePointerCapture(e.pointerId)}
      />
      </div>
  )
  return div
  ;
}
