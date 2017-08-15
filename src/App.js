import React, {Component} from 'react';
import Intro from './components/Intro';
import Task from './components/Task';
import Results from './components/Results';
import Progress from './components/Progress';

import './App.css';
import Table from './components/Table';

// base for multiplication table by levels
const numbers = [
    [1, 2, 3],
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
];

class App extends Component {
    constructor() {
        super();
        const level = window.localStorage.level || 0;
        // generate tasks and possible solutions
        this.table = getTable(level);
        // generate randomness
        this.queue = getQueue(this.table.length);
        this.state = {
            // is game started?
            play: false,
            // current level
            level,
            // current task
            task: 0,
            // given answers
            answers: [],
            // need help?
            tip: true,
            // current selected cell 'n × n'
            cell: '',
            // answer check status (fail, correct, default)
            check: 'default',
            score: {
                correct: 0,
                fail: 0,
                start: Date.now(),
                end: 0
            }
        };
    }

    gameSwitch = (bol) => {
        if (bol) {
            this.queue = getQueue(this.table.length);
        }
        this.setState({
            play: bol,
            task: 0,
            tip: true,
            answers: [],
            score: {
                correct: 0,
                fail: 0,
                start: Date.now(),
                end: 0
            }
        });
    };

    selectCell = (e) => {
        e.preventDefault();
        let target;
        if (e.targetTouches && e.targetTouches[0]) {
            target = document.elementFromPoint(
                e.targetTouches[0].clientX,
                e.targetTouches[0].clientY
            );
        } else {
            target = e.target;
        }

        if (target.dataset.cell === 'locked') return;

        const cell = this.state.cell;
        let newCell = target.dataset.cell || cell;
        this.setState({cell: newCell});
    };

    makeCheck = (e) => {
        e.preventDefault();
        const is_table = Array.from(e.target.classList)
            .some(element => (
                element === 'table' || element === 'table__cell'
            ));

        if (!is_table) return;

        let {task, answers, cell, score, check} = {...this.state};
        const solutions = this.table[this.queue[task]].solutions;
        const correct = solutions.includes(cell);

        if (correct && !answers.includes(cell)) {
            answers.push(cell);
        }

        if (correct) {
            score.correct++;
            check = 'correct';
        } else {
            score.fail++;
            check = 'fail';
        }

        this.setState({check, answers, score});
    };

    nextTask = () => {
        const {task, answers, level, score} = {...this.state};
        const solutions = this.table[this.queue[task]].solutions;

        const newState = {
            task, level, answers,
            check: 'default',
            tip: false,
            cell: '',
        };

        const isLastSolutionInTask = answers.length === solutions.length;
        const isLastTaskInLevel = task === this.queue.length - 1 && isLastSolutionInTask;
        const isLastTaskInLastLevel = level === 2 && isLastTaskInLevel && isLastSolutionInTask;

        // when it's a last task in queue go to the new level
        if (isLastTaskInLevel) {
            newState.level = level === 2 ? 2 : level + 1;
            this.table = getTable(newState.level);
            this.queue = getQueue(this.table.length);
        }

        // when it's a last task in last level stop the game
        if (isLastTaskInLastLevel) {
            newState.play = false;
            score.end = Date.now();
            newState.score = score;
        }

        // when it's a last solution go to the next task
        if (isLastSolutionInTask) {
            newState.task = isLastTaskInLevel ? 0 : task + 1;
            newState.answers = [];
        }

        this.setState(newState);
    };

    render() {
        const {
            task, check, answers, cell, tip, play, level, score
        } = {...this.state};
        const {table, queue} = {...this};
        const currentTask = table[queue[task]].task;
        const solutions = table[queue[task]].solutions;

        const keyboardClass = {
            fail: 'keyboard keyboard--fail',
            correct: 'keyboard keyboard--correct',
            default: 'keyboard'
        };

        const selectedClass = cell.length ? ' selected-cell--visible' : ' selected-cell--hidden';

        return (
            <div className={`App ${play ? 'app--playing' : 'app--learning'}`}
                 onMouseMove={this.selectCell}
                 onMouseUp={this.makeCheck}
                 onTouchMove={this.selectCell}
                 onTouchStart={this.selectCell}
                 onTouchEnd={this.makeCheck}>

                {play ? Task({
                    currentTask, solutions, check, answers,
                    nextTask: this.nextTask,
                    gameSwitch: this.gameSwitch
                }) : (
                    Intro({gameSwitch: this.gameSwitch})
                )}

                {!play && (score.correct || score.fail) ? (
                    Results({score, gameSwitch: this.gameSwitch})
                ) : null}

                {play ? Progress({task, total: table.length}) : null}

                <div className={keyboardClass[check]}>
                    {play ?
                        <span className={`selected-cell${selectedClass}`}>
                            {cell}
                        </span> : null
                    }

                    {
                        Table({numbers, cell, task, tip, table, queue, play, level})
                    }
                </div>
            </div>
        );
    }
}

function getTable(level) {
    return numbers[level].reduce((arr, firstNum) => {

        const items = numbers[2].reduce((tasks, secNum) => {
            const task = firstNum * secNum;
            const is_exist = arr.some(prev => prev.task === task);

            if (is_exist) return tasks;

            const solutions = numbers[2].reduce((result, num) => {
                if ((firstNum * secNum) % num) {
                    return result;
                } else if ((firstNum * secNum / num) > (numbers[level].length)) {
                    return result;
                } else {
                    result.push(`${(firstNum * secNum) / num} × ${num}`);
                    return result;
                }
            }, []);
            tasks = [...tasks, {task, solutions}];
            return tasks;
        }, []);

        return items.length ? [...arr, ...items] : arr;
    }, [{task: 1, solutions: ['1 × 1']}]);
}

function getQueue(max = 41) {
    let queue = [];
    while (queue.length < max) {
        const random_num = (Math.ceil(Math.random() * max)) - 1;
        if (queue.indexOf(random_num) > -1) continue;
        queue[queue.length] = random_num;
    }
    return queue;
}

export default App;
