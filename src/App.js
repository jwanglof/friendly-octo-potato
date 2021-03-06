import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import Question from './Question';
import Intro from './Intro';
import Service from './Service';
import Events from './Events';
import firebase from './firebase';
import Header from "./Header";
import AddQuestion from "./AddQuestion";
import AllQuestions from "./AllQuestions";
import Finished from "./Finished";
import Leaderboard from "./Leaderboard";
const uuidv1 = require('uuid/v1');
const Cookies = require('cookies-js');
const random_name = require('node-random-name');

class App extends Component {
    currentUuid;
    firebasePlayersDb = firebase.database().ref('players');
    firebaseQuestionsDb = firebase.database().ref('questions');
    firebasePlayerData;
    maximumQuestions = 15;

    constructor(props) {
        super(props);

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
            const created = Date.now();
            const name = random_name();
            this.firebasePlayersDb.child(this.currentUuid).set({
                created,
                name
            }).then(error => {
                if (!error) {
                    this.setState({
                        playerCreated: created,
                        playerName: name
                    });
                    Events.emitter.emit(Events.constants.nameChanged, name);
                }
            });

            this.fetchQuestions();
        } else {
            Service.setUuid(this.currentUuid);
            this.firebasePlayersDb.child(this.currentUuid).once('value', val => {
                this.firebasePlayerData = val.val();
                if (this.firebasePlayerData) {
                    this.setState({
                        playerCreated: this.firebasePlayerData.created,
                        playerName: this.firebasePlayerData.name || ''
                    });

                    Events.emitter.emit(Events.constants.nameChanged, this.firebasePlayerData.name || 'Lozl');

                    if (!this.firebasePlayerData.answers || (this.firebasePlayerData.answers && this.firebasePlayerData.answers.length === 0)) {
                        this.fetchQuestions();
                    } else {
                        Events.emitter.emit(Events.constants.noQuestionsFetched);
                    }
                } else {
                    this.fetchQuestions();
                }
            });
        }


        Events.emitter.addListener(Events.constants.introHidden, () => {
            this.setState({
                logoClasses: 'App-logo App-logo-animation'
            });
        });
    }

    render() {
        return (
            <div>
                <Header {...this.state} />
                <div className="container">
                    <Switch>
                        <Route exact path='/' component={Intro}/>
                        <Route exact path='/add-question' component={AddQuestion}/>
                        <Route exact path='/all-questions' component={AllQuestions}/>
                        <Route exact path='/finished' component={Finished}/>
                        <Route exact path='/leaderboard' component={Leaderboard}/>
                        <Route path='/question/:questionId' component={Question}/>
                    </Switch>
                </div>
            </div>
        );
    }

    fetchQuestions() {
        const chosenQuestionKeys = [];
        const chosenQuestions = {};
        this.firebaseQuestionsDb.once('value', snapshot => {
            const data = snapshot.val();
            Service.allQuestions = data;

            Events.emitter.emit(Events.constants.allQuestionsFetched, data);

            const keys = Object.keys(data);
            const levelZero = [];
            const levelOne = [];
            const levelTwo = [];
            for (let i = 0, len = this.maximumQuestions; i < len; i++) {
                const randomKey = App.getRandomKey(keys);
                if (chosenQuestionKeys.indexOf(randomKey) === -1) {
                    switch (parseInt(data[randomKey].level, 10)) {
                        case 0:
                            levelZero.push(randomKey);
                            break;
                        case 1:
                            levelOne.push(randomKey);
                            break;
                        case 2:
                            levelTwo.push(randomKey);
                            break;
                        default:
                            console.log(`${randomKey} doesn't have a level :(`);
                    }
                    // Add all keys to a temp-array so we can search it
                    chosenQuestionKeys.push(randomKey);
                    chosenQuestions[randomKey] = data[randomKey];
                    console.log(randomKey, data[randomKey], data[randomKey].level);
                } else {
                    // If we already have the question we need to make the length longer so we can fetch a new question!
                    len++;
                }
            }

            Service.questions = {
                keys: [...levelZero, ...levelOne, ...levelTwo],
                questions: chosenQuestions
            };
        });
    }

    static getRandomKey(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

export default App;
