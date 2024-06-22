import HistoryBar from './HistoryBar';
import History from './History';
import  { useState, useEffect, useRef } from 'react';

export default function Scoreboard({ timer, history} ) {
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const historyModalRef = useRef(null);
    const currentScore = history.map(x => x.score).reduce((x,y) => x + y, 0);

    const handleClickOutside = (event) => {
        if (historyModalRef.current && !historyModalRef.current.contains(event.target)) {
            setHistoryModalOpen(false);
        }
        if (historyModalRef.current && !historyModalRef.current.contains(event.target)) {
            setHistoryModalOpen(false);
        }
      };

    useEffect(() => {
        if (historyModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [historyModalOpen]);

    const histModal = (
        <ul>
            {history.map(x=> <li>{x.word}</li>)}
        </ul>
    )

    return (
        <div className="scoreboard">
            <div>&#128337; {timer}</div>
            <div># {currentScore}</div>
            <HistoryBar history={history}/>
            <button onClick={()=>setHistoryModalOpen(true)}>&#128214;</button>
            
            {historyModalOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content" ref={historyModalRef}>
            <span className="close" onClick={() => setHistoryModalOpen(false)}>&times;</span>
            <History history={history}/>
          </div>
        </div>
      )}
        </div>
      );
}