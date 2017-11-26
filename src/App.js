import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import Question from './Question';
import Intro from './Intro';
import Service from './Service';
import firebase from './firebase';
import Header from "./Header";
import AddQuestion from "./AddQuestion";
import AllQuestions from "./AllQuestions";
import Finished from "./Finished";
const uuidv1 = require('uuid/v1');
const Cookies = require('cookies-js');

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

        setTimeout(() => {
            console.log(5666666);
            this.setState({
                logoClasses: 'App-logo App-logo-animation'
            });
        }, 1500);

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
            this.firebasePlayersDb.child(this.currentUuid).once('value', val => {
                this.firebasePlayerData = val.val();
                // this.state.playerCreated = this.firebasePlayerData.created;
                this.setState({
                    playerCreated: this.firebasePlayerData.created / 1000,
                    playerName: this.firebasePlayerData.name || ''
                });
            });
        }
    }

    componentDidUpdate() {
        // window.scrollTo(0, 0);
    }

    componentWillMount() {
        this.fetchQuestions();
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
                        <Route path='/question/:questionId' component={Question}/>
                    </Switch>
                </div>
            </div>
        );
    }

    fetchQuestions() {
        console.log("FETCH!");
        const chosenQuestionKeys = [];
        const chosenQuestions = {};
        this.firebaseQuestionsDb.once('value', snapshot => {
            const data = snapshot.val();
            const keys = Object.keys(data);
            const levelZero = [];
            const levelOne = [];
            const levelTwo = [];
            for (let i = 0, len = this.maximumQuestions; i < len; i++) {
                const randomKey = App.getRandomKey(keys);
                if (chosenQuestionKeys.indexOf(randomKey) === -1) {
                    switch (data[randomKey].level) {
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
                    // chosenQuestionKeys.push(randomKey);
                    chosenQuestions[randomKey] = data[randomKey];
                } else {
                    // If we already have the question we need to make the length longer so we can fetch a new question!
                    // len++;
                    console.log('Should make the length longer!');
                }
            }

            Service.questions = {
                // keys: chosenQuestionKeys,
                keys: levelZero.concat(levelOne, levelTwo),
                questions: chosenQuestions
            };
        });
    }

    static getRandomKey(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

export default App;
