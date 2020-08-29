import React from 'react';
import HistoryLine from './HistoryLine';
import './history.scss';

export default class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.history !== this.props.history;
    }

    render() {
        console.log("--History Render()--");
        // console.log(this.props.history);
        return (
            <div>
                {contents(this.props)}
            </div>
        )
    }
}


function contents(props) {
    let h = <span>--NO HISTORY--</span>;
    if (props.history && props.history.length > 0) {
        return (
            <ol>
                {props.history.map((line, idx) => (
                    <li key={idx}>{
                        <HistoryLine line={line} />
                    }</li>
                ))}
            </ol>
        );
    }

    return h;
}
