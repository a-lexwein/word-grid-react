import History from '../components/History';

export default function Scoreboard({ timer, history }) {
    const currentScore = history.map(x=>x.score).reduce((x,y)=>x+y,0);

    return (
        <div className="scoreboard">
            <div>&#128337; {timer}</div>
            <div> {currentScore}</div>
            <History history={history}></History>
            {/* <button>&#128214;</button> */}
        </div>
      );
}