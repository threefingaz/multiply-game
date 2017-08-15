import React from 'react';
// import Transition from 'react-transition-group/Transition';

import './Task.css';

const task = (props) => {
    const checkClass = {
        fail: 'fail',
        correct: 'correct',
        default: ''
    };
    return <div className="display">
        <h1 className={`task stroked ${checkClass[props.check]}`}
            onAnimationEnd={props.nextTask} data-text={props.currentTask}>
            {props.currentTask}
        </h1>
        <span className="task__equal stroked" data-text="=">=</span>
        <ul className="solutions">
            {props.solutions && props.solutions.length ?
                (props.solutions.map((solution, i) => (
                    <li key={i}
                        className={`solution${props.answers[i] ? ' solution--correct' : ' '}`}>
                        {props.answers[i] || '? × ?'}
                    </li>))) : null}
        </ul>
        <button className="button-stop"
            onClick={() => {props.gameSwitch(false)}}
            onTouchEnd={() => {props.gameSwitch(false)}}>
            ×
        </button>
    </div>;
};

export default task;