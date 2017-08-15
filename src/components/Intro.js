import React from 'react';

import './Intro.css';

const intro = ({gameSwitch}) => (
    <div className="display">
        <h1 className="intro-header">
            Таблица<br/>умножения
        </h1>
        <button className="button button-play"
            onClick={() => {gameSwitch(true)}}
            onTouchEnd={() => {gameSwitch(true)}}>
            Играть
        </button>
    </div>
);

export default intro;