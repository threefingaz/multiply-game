import React from 'react';
import Stopwatch from './svg/icon-stopwatch';
import './Results.css';

const results = ({score, gameSwitch}) => {
    const seconds = (score.end - score.start) / 1000;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds - m * 60);

    return <div className="results">
        <button className="button-stop"
                onTouchEnd={() => {gameSwitch(false)}}
                onClick={() => {gameSwitch(false)}}>
        </button>
        <div className="result__fail">
            <span className="fail-digit stroked"
                  data-text={score.fail}>
                {score.fail}
            </span>
            <span className="fail-text">ошибок</span>
        </div>
        <span className="result__time">
            {Stopwatch()} {m < 10 ? `0${m}` : m} : {s < 10 ? `0${s}` : s}
        </span>
    </div>;
};

export default results;