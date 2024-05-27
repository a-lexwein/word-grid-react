export default function History({ history }) {
    const colorRight = 'green';
    const colorWrong = 'red';
    return <div>
        {
        history.map((x, i, data) => (
          <span
            key={i}
            style={{ color: x.valid ? colorRight : colorWrong }}
        >{x.word} </span>
        ))
      }
    </div>
}