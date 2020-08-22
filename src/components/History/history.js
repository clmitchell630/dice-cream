import React from 'react';
import './history.scss';

export default class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        console.log(this.props.history);
        return(
            <div>
                {contents(this.props)}
            </div>
        )
    }
}

function contents(props) {
    if (props.history && props.history.length > 0) {
        return (
            <ol>
                {props.history.map((line, idx) => (
                    <li key={idx}>{line}</li>
                ))}
            </ol>
        );
    } else {
        return <span>--NO HISTORY--</span>;
    }
}