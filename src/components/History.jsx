export default function History({ history }) {
    const colorRight = 'green';
    const colorWrong = 'red';
    // Create a copy of the history array and reverse it
    const reversedHistory = [...history].reverse();
  
    return (
      <ol className="history"> 
      {
        reversedHistory.map((x, i) => (
          <li
            key={i}
            style={{ color: x.valid ? colorRight : colorWrong }}
          >
            {x.word} {x.score}
          </li>
        ))
      }
      </ol>
    )
  }
  