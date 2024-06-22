import History from '../components/History';
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
        <ol>
            {history.map(x=> <li>{x.word}</li>)}
        </ol>
    )

    return (
        <div className="scoreboard">
            <div>&#128337; {timer}</div>
            <div># {currentScore}</div>
            <History history={history}></History>
            <button onClick={()=>setHistoryModalOpen(true)}>&#128214;</button>
            
            {historyModalOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content" ref={historyModalRef}>
            <span className="close" onClick={() => setHistoryModalOpen(false)}>&times;</span>
            {histModal}
          </div>
        </div>
      )}
        </div>
      );
}