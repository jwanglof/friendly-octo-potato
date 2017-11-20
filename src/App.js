import React, { Component } from 'react';
import waegg from './waegg.png';
import './App.css';
import Question from './Question';
import Intro from './Intro';
import Service from './Service';
import firebase from './firebase';
const uuidv1 = require('uuid/v1');
const Cookies = require('cookies-js');
const Timestamp = require('react-timestamp');

class App extends Component {
    currentUuid;
    firebaseDb = firebase.database().ref('test');
    firebasePlayersDb = firebase.database().ref('players');
    firebaseQuestionsDb = firebase.database().ref('questions');
    firebasePlayerData;

    constructor() {
        super();

        this.asd = this.asd.bind(this);

        this.state = {
            playerCreated: 0,
            next: false,
            logoClasses: 'App-logo'
        };

        this.currentUuid = Cookies.get(Service.constCookieUuid);

        if (!this.currentUuid) {
            this.currentUuid = uuidv1();
            Service.setUuid(this.currentUuid);
            Cookies.set(Service.constCookieUuid, this.currentUuid);
            this.firebasePlayersDb.child(this.currentUuid).set({
                created: Date.now()
            });
        } else {
            Service.setUuid(this.currentUuid);
            this.firebasePlayersDb.child(this.currentUuid).on('value', val => {
                console.log(444, val.val());
                this.firebasePlayerData = val.val();
                // this.state.playerCreated = this.firebasePlayerData.created;
                this.setState({
                    playerCreated: this.firebasePlayerData.created / 1000,
                    playerName: this.firebasePlayerData.name || ''
                });
            });
        }
    }

    componentWillUpdate(prevProps, prevState) {
        console.log(43244, this.state);
    }

    render() {
        return (
            <div>
                <header className="jumbotron text-center">
                    <img src={waegg} className={this.state.logoClasses} alt="logo" />
                    <h2>
                        Välkommen, {this.state.playerName || 'UUID ' + this.currentUuid}
                    </h2>
                    <h4 >Du skapades: <Timestamp time={this.state.playerCreated}/></h4>
                </header>
                <div className="container">
                    <Intro clickAction={this.asd}/>
                    {/*<Question/>*/}
                    <div className="mt-5">
                        <button onClick={this.createQuestions}>Create questions</button>
                    </div>
                </div>
            </div>
        );
    }

    createQuestions() {
        console.log(3333);
        const firebaseQuestionsDb = firebase.database().ref('players');
        // for (let i = 0, len = 10; i < len; i++) {
        //     const q = this.getQuestion(i);
        //     q.category = '';
        //     q.question = '';
        //     // firebaseQuestionsDb.push(q);
        // }
        firebaseQuestionsDb.child('lala').set({foo: 1, bar: 2});
    }

    asd(par) {
        console.log(555554444, par);
        this.setState({
            logoClasses: `${this.state.logoClasses} App-logo-animation`
        })
    }
}

export default App;
