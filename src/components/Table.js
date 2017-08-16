import React from 'react';
import LockIcon from './svg/icon-stopwatch';

import './Table.css';

const Table = ({numbers, cell, task, tip, table, queue, play, level }) => {
    const renderCol = (num1, num2, i) => {
        const [cellNum1, cellNum2] = cell.length ? cell.split('×') : [0, 0];

        let selectedClass = '';
        let tipClass = '';
        const currentTask = table[queue[task]];
        if (play) {
            if (cellNum1 >= num1 && cellNum2 >= num2) {
                selectedClass = ' number--selected'
            }
            if (play && task === 0 && tip && currentTask.solutions) {
                const solution = currentTask.solutions[0];
                if (!solution) return;
                tipClass = solution === `${num1} × ${num2}` ? ' tip' : '';
            }
        }

        let colClass = '';
        if (!play) {
            if (num1 * num2 === num1 || num1 * num2 === num2) {
                colClass = ' number--byOne';
            }
            if (num1 === num2) {
                colClass = ' number--sameNumbers';
            }
        }


        let isCellLocked;
        switch (level) {
            case 0:
                isCellLocked = num1 > 3;
                break;
            case 1:
                isCellLocked = num1 > 6;
                break;
            default:
                isCellLocked = false;
        }

        const data = !play || isCellLocked ? `locked` : `${num1} × ${num2}`;

        return (
            <td key={i} className={`table__cell${colClass}${selectedClass}${tipClass}`} data-cell={data}>
                {!play ? (
                    <span className="digit">{num1 * num2}</span>
                ) : null}
            </td>
        );
    };

    const renderRow = (i) => (
        <tr key={i} className="table__row" data-tablerow="true">
            <th className="table__cell table__head first-cell">
                <span className="digit">{i + 1}</span>
            </th>
            {numbers[2].map((number, j) => renderCol(number, i + 1, j))}
        </tr>
    );

    return (
        <table className="table">
            <tbody>
            <tr className="table__row">
                <th className="table__cell table__head"></th>
                {numbers[2].map((number, i) => (
                    <th key={i} className="table__cell table__head">
                        {number}
                    </th>
                ))}
            </tr>
            {numbers[2].map((number, i) => renderRow(i))}
            </tbody>
        </table>
    )
};

export default Table;
