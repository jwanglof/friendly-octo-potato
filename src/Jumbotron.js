import React, { Component } from 'react';
import waegg from './waegg.png';
import Events from './Events';
const Timestamp = require('react-timestamp');

class Jumbotron extends Component {

    constructor() {
        super();
        this.state = {
            name: ''
        }
    }

    componentDidMount() {
        Events.emitter.addListener(Events.constants.nameChanged, (newName) => {
            console.log('loooool', newName);
            this.setState({
                name: newName
            });
        });
    }

    render() {
        return (
            <div className='jumbotron text-center'>
                <img src={waegg} className={this.props.logoClasses} alt="logo" />
                <h2>
                    Välkommen, {this.state.name}
                </h2>
                <h4>Du skapades: <Timestamp time={this.props.playerCreated}/></h4>
            </div>
        );
    }

    // renderName() {
    //     if (this.state.playerName) {
    //         return this.state.playerName;
    //     } else if (this.currentUuid) {
    //         return `UUID ${this.currentUuid}`;
    //     }
    //     return 'Smith'
    // }
}

export default Jumbotron;