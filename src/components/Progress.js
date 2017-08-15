import React from 'react';

const progress = ({task, total}) => (
    <div style={{
        height: `4px`,
        backgroundColor: `var(--color-darkblue)`,
        position: `relative`,
        width: `100%`
    }}>
        <div style={{
            height: `4px`,
            backgroundColor: `var(--color-green)`,
            width: `${100 * task / total}%`,
            transition: `width .1s var(--bouncy-easing)`
        }}></div>
    </div>
);

export default progress;