import React from 'react';

const progress = (props) => (
    <div style={{
        height: '2px',
        backgroundColor: '#2af598',
        width: `${props.task}%`
    }}></div>
);

export default progress;