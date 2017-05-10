/**
 * @author lusinabrian on 11/05/17.
 * @notes: Messages Container
 */

import React from 'react';
import { connect } from 'react-redux';

const Messages = ({ messages }) =>{
    return(
        <div className="panel messages">
            <ul>
                {
                    messages.slice(-3).map((msg, i) => {
                        return <li key={i}>{msg}</li>;
                    })
                }
            </ul>
        </div>
    );
};

/**
 * Maps state of redux store to props of this container
 * Will merge these props to state of store and allow us to keep in sync with store, format props
 * and pass them to container
 * */
const mapStateToProps = ({ ui }) =>{
    return { messages: ui.messages};
};

/**
 * Connect Messages container to redux store and return a function
 * that takes this container as an argument
 * */
export default connect(mapStateToProps)(Messages);
