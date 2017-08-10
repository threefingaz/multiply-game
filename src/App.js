import React, {Component} from 'react';
import Task from './components/Task';
import Progress from './components/Progress';

import './App.css';
import Table from './components/Table';

// base for multiplication table
const n = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
            play: true,
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
            check: 'default'
        };
    }

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
        this.setState({
            cell: newCell
        });
    };

    makeCheck = (e) => {
        e.preventDefault();
        const is_table = Array.from(e.target.classList)
            .some(element => (
                element === 'table' || element === 'table__cell'
            ));
        if (!is_table) return;

        const {task, answers, cell} = {...this.state};
        const solutions = this.table[this.queue[task]].solutions;
        const correct = solutions.includes(cell);

        if (correct && !answers.includes(cell)) {
            answers.push(cell);
        }

        if (window.navigator.vibrate) {
            correct ? (
                window.navigator.vibrate([200])
            ) : (
                window.navigator.vibrate([100, 100])
            );
        }

        this.setState({
            check: correct ? 'correct' : 'fail',
            answers
        });
    };

    nextTask = () => {
        const {task, answers, level} = {...this.state};
        const solutions = this.table[this.queue[task]].solutions;

        if (!solutions) return this.nextTask();

        let newLevel = level;
        if (task === this.queue.length - 1) {
            newLevel = level === 2 ? 2 : level + 1;
            this.table = getTable(newLevel);
            this.queue = getQueue(this.table.length);
        }

        if (answers.length === solutions.length) {
            this.setState({
                task: task + 1,
                check: 'default',
                tip: false,
                level: newLevel,
                answers: [],
                cell: ''
            });
            return;
        }

        this.setState({
            check: 'default',
            tip: false,
            level: newLevel,
            cell: '',
        });
    };

    render() {
        const {task, check, answers, cell, tip, play, level} = {...this.state};
        const {table, queue} = {...this};
        const currentTask = table[queue[task]].task;
        const solutions = table[queue[task]].solutions;

        const numbersClass = {
            fail: 'keyboard keyboard--fail',
            correct: 'keyboard keyboard--correct',
            default: 'keyboard'
        };

        return (
            <div className="App"
                 onMouseMove={this.selectCell}
                 onMouseUp={this.makeCheck}
                 onTouchMove={this.selectCell}
                 onTouchStart={this.selectCell}
                 onTouchEnd={this.makeCheck}>

                {Task({
                    currentTask, solutions, check, answers, nextTask: this.nextTask
                })}

                {Progress({task})}
                <div className={numbersClass[check]}>
                    <span className="selected">{cell}</span>
                    {Table({
                        n, numbers, cell, task, tip, table, queue, play, level
                    })}
                </div>
            </div>
        );
    }
}

function getTable(level) {
    return numbers[level].reduce((arr, firstNum) => {
        const items = numbers[2].reduce((tasks, secNum) => {
            const task = firstNum * secNum;

            const is_exist = arr.some(prev => {
                return prev.task === task;
            });

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
            tasks = [...tasks, { task, solutions }];
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
