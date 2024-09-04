import _ from 'lodash'

export default function newStartingLetters(nRows) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  let arr = []

  for (let i = 0; i < nRows; ++i) {
    // randomly place 2 letters
    let row = _.shuffle([-60, -30, 0, 30, 60])
      .slice(0,2)
      .map(x => ({
        x: x,
        y: -30 + i * 40,
        letter: _.sample(alphabet),
        selected: false,
      }))
    arr.push(row) 
  }
  return arr.flat()
}
