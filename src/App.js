import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Question from './Question';
import Service from './Service';
import firebase from './firebase';
const uuidv1 = require('uuid/v1');
const Cookies = require('cookies-js');

class App extends Component {
    currentUuid;
    firebaseDb = firebase.database().ref('test');
    firebasePlayersDb = firebase.database().ref('players');
    firebaseQuestionsDb = firebase.database().ref('questions');
    firebasePlayerData;

    constructor() {
        super();
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
            });
            // this.firebaseDb.on('value', snapshot => {
            //     console.log(4343, snapshot);
            //     console.log(4343, snapshot.val());
            // });
        }
    }

    getCreated() {
        if (this.firebasePlayerData && this.firebasePlayerData.created) {
            return this.firebasePlayerData.created;
        }
        return 0;
    }

    componentWillUpdate(prevProps, prevState) {
        console.log(43244, this.firebasePlayerData);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Välkommen, UUID {this.currentUuid}</h1>
                    <h4 >Du skapades: {this.getCreated()}</h4>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <div className="container">
                    <Question/>
                </div>
                <div>
                    <button onClick={this.createQuestions}>Create questions</button>
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

    static getQuestion(id) {
        return {
            id
        }
    }
}

export default App;
