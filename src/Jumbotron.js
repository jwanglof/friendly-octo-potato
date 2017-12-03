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
                <h4>Du skapades: <Timestamp time={this.props.playerCreated / 1000}/></h4>
            </div>
        );
    }
}

export default Jumbotron;