import React from 'react';
// import Transition from 'react-transition-group/Transition';

import './Task.css';

const task = (props) => {
    const checkClass = {
        fail: 'fail',
        correct: 'correct',
        default: ''
    };
    return (
        <div className="display">
            <h1 className={`task ${checkClass[props.check]}`}
                onAnimationEnd={props.nextTask}>
                {props.currentTask}
            </h1>
            &nbsp;=&nbsp;
            <ul className="solutions">
                {props.solutions && props.solutions.length ?
                    (props.solutions.map((solution, i) => (
                        <li key={i}
                            className={`solution${props.answers[i] ? ' solution--correct' : ' '}`}>
                    {props.answers[i] || '? × ?'}
                </li>))) : null}
            </ul>
        </div>
    );
};

export default task;