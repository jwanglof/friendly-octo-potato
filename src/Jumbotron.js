import React, { Component } from 'react';

import waegg from './waegg.png';

const Timestamp = require('react-timestamp');

class Jumbotron extends Component {
    render() {
        console.log(123321, this.props);
        // TODO Add class to the logo when the intro is 'hidden'!
        return (
            <div className='jumbotron text-center'>
                <img src={waegg} className={this.props.logoClasses} alt="logo" />
                <h2>
                    Välkommen, {this.renderName()}
                </h2>
                <h4>Du skapades: <Timestamp time={this.props.playerCreated}/></h4>
            </div>
        );
    }

    renderName() {
        if (this.props.playerName) {
            return this.props.playerName;
        } else if (this.currentUuid) {
            return `UUID ${this.currentUuid}`;
        }
        return 'Smith'
    }
}

export default Jumbotron;