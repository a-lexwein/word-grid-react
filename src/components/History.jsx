export default function History({ history }) {
    const colorRight = 'green';
    const colorWrong = 'red';
    const currentScore = history.map(x=>x.score).reduce((x,y)=>x+y,0);
    return <div> Score: {currentScore}
        <div> 
        {
        history.map((x, i, data) => (
          <span
            key={i}
            style={{ color: x.valid ? colorRight : colorWrong }}
        >{x.word} {x.score} </span>
        ))
      }
      </div>
    </div> 
}