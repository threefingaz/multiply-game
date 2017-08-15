import React from 'react';
// import Transition from 'react-transition-group/Transition';

import './Results.css';

const results = ({score}) => {
    const seconds = (score.end - score.start) / 1000;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds - m * 60);

    return <div className="results">
        <div className="result__fail">
            <span className="fail-digit">{score.fail}</span>
            <span className="fail-text">ошибок</span>
        </div>
        <span className="result__time">
            ⏱ {m} : {s}
        </span>
        <button className="closeResults">
            Закрыть
        </button>
    </div>;
};

export default results;