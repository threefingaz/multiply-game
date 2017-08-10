import React from 'react';
import LockIcon from'./svg/icon-lock';

import './Table.css';

const Table = (props) => {
    const renderCol = (num1, num2, i) => {
        const [cellNum1, cellNum2] = props.cell.length ? props.cell.split('×') : [0, 0];

        let selectedClass = '';
        if (cellNum1 >= num1 && cellNum2 >= num2) {
            selectedClass = ' number--selected'
        }

        let colClass = '';
        if (num1 * num2 === num1 || num1 * num2 === num2) {
            colClass = ' number--byOne';
        }
        if (num1 === num2) {
            colClass = ' number--sameNumbers';
        }

        let tipClass = '';
        const table = props.table[props.queue[props.task]];
        if (props.task === 0 && props.tip && table.solutions) {
            const solution = table.solutions[0];
            if (!solution) return;
            tipClass = solution === `${num1} × ${num2}` ? ' tip' : '';
        }

        let isCellLocked;
        switch (props.level) {
            case 0:
                isCellLocked = num1 > 3;
                break;
            case 1:
                isCellLocked = num1 > 6;
                break;
            default:
                isCellLocked = false;
        }

        const data = isCellLocked ? `locked` : `${num1} × ${num2}`;

        return (
            <td key={i} className={`table__cell${colClass}${selectedClass}${tipClass}`} data-cell={data}>
                {!props.play ? (
                    <span className="digit">{num1 * num2}</span>
                ) : null}
                {isCellLocked ? (
                    <span className="digit">{LockIcon()}</span>
                ) : null}
            </td>
        );
    };

    const renderRow = (i) => (
        <tr key={i} className="table__row" data-tablerow="true">
            <th className="table__cell table__head first-cell">
                <span className="digit">{i + 1}</span>
            </th>
            {props.n.map((number, j) => renderCol(number, i + 1, j))}
        </tr>
    );

    return (
        <table className="table">
            <tbody>
            <tr className="table__row">
                <th className="table__cell table__head"></th>
                {props.n.map((number, i) => (
                    <th key={i} className="table__cell table__head">
                        {number}
                    </th>
                ))}
            </tr>
            {props.n.map((number, i) => renderRow(i))}
            </tbody>
        </table>
    )
};

export default Table;
