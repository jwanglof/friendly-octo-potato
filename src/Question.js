import React, { Component } from 'react';
import Service from './Service';
import firebase from './firebase';

import waegg from './waegg.png';
import {Redirect} from "react-router-dom";

class Question extends Component {
    firebaseAnswersDb = firebase.database().ref('answers');
    firebasePlayersDb = firebase.database().ref('players');
    userAnswers;
    originalGameTime;
    timerClass = '';

    constructor(props) {
        super(props);

        this.state = {
            question: {},
            answers: {},
            chosenAnswer: undefined,
            submitButtonInactive: true,
            redirect: false,
            gameTimerSeconds: 100
        };

        this.setQuestion = this.setQuestion.bind(this);
        this.getAnswers = this.getAnswers.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.getGameTimer = this.getGameTimer.bind(this);
        this.runGameTimer = this.runGameTimer.bind(this);
    }

    componentDidMount() {
        console.log('DID MOUNT!');
        this.setQuestion();

        this.userAnswers = [];
        const playerRef = this.firebasePlayersDb.child(`${Service.getUuid()}`);
        playerRef.once('value', snapshot => {
            const data = snapshot.val();
            if (data.answers) {
                this.userAnswers = data.answers;
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        // TODO Ugly imo, and pretty unreadable!
        if (prevState.redirect && !this.state.redirect) {
            console.log('NEW QUESTION!');
            this.setQuestion();
        }
    }

    render() {
        if (this.state.redirect) {
            const path = `/question/${this.state.redirect}`;
            this.setState({
                redirect: false
            });
            return (<Redirect to={path} push={true} />);
        } else {
            return (
                <div className="row">
                    <div className="col-12 text-left">
                        <h5>Tid kvar: <span className={this.timerClass}>{this.state.gameTimerSeconds}</span></h5>
                        <h3>Fråga: {this.state.question.question} (#Frågenummer)</h3>
                        <h5>Kategori: {this.state.question.category}</h5>
                        <div className="form-check">
                            <label className="form-check-label">
                                <input className="form-check-input" type="radio" name="exampleRadios"
                                       id="exampleRadios1" value="answerOne" onChange={this.handleRadioChange}/>
                                {this.state.answers.one || <img src={waegg} className="App-logo-small" alt="logo"/>}
                            </label>
                        </div>
                        <div className="form-check">
                            <label className="form-check-label">
                                <input className="form-check-input" type="radio" name="exampleRadios"
                                       id="exampleRadios2" value="answerCross" onChange={this.handleRadioChange}/>
                                {this.state.answers.cross || <img src={waegg} className="App-logo-small" alt="logo"/>}
                            </label>
                        </div>
                        <div className="form-check">
                            <label className="form-check-label">
                                <input className="form-check-input" type="radio" name="exampleRadios"
                                       id="exampleRadios3" value="answerTwo" onChange={this.handleRadioChange}/>
                                {this.state.answers.two || <img src={waegg} className="App-logo-small" alt="logo"/>}
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary" onClick={this.submitAnswer}
                                disabled={this.state.submitButtonInactive}>Nästa fråga!
                        </button>
                    </div>
                </div>
            );
        }
    }

    setQuestion() {
        if (Service.questions && Service.questions.questions) {
            this.setState({
                question: Service.questions.questions[this.props.match.params.questionId]
            });
            Promise.all([
                this.getGameTimer(Service.questions.questions[this.props.match.params.questionId]),
                this.getAnswers()
            ])
                .then(res => {
                    this.setState({
                        gameTimerSeconds: res[0],
                        ...res[1]
                    });
                    return this.runGameTimer();
                });
            // TODO Fix the 'numberOfShows' in the DB
        } else {
            // Ugly, must wait for the questions to arrive. This should be handled by some kind of event
            setTimeout(() => {
                this.setQuestion();
            }, 500);
        }
    }

    getAnswers() {
        console.log(this.props.match.params);
        // TODO Do not get the correct answer!
        return new Promise(resolve => {
            this.firebaseAnswersDb.child(this.props.match.params.questionId).once('value', snapshot => {
                const data = snapshot.val();
                const newState = {
                    answers: {
                        one: data['answerOne'],
                        cross: data['answerCross'],
                        two: data['answerTwo']
                    }
                };

                if (this.state.chosenAnswer) {
                    newState.submitButtonInactive = false;
                }

                resolve(newState);
            });
        });
    }

    handleRadioChange(event) {
        const target = event.target;
        const value = target.value;

        this.setState({
            chosenAnswer: value,
            submitButtonInactive: false
        });
    }

    submitAnswer() {
        const playerRef = this.firebasePlayersDb.child(`${Service.getUuid()}`);

        this.userAnswers.push({
            questionId: this.props.match.params.questionId,
            chosenAnswer: this.state.chosenAnswer
        });

        playerRef.update({
            answers: this.userAnswers
        }).then(error => {
            if (!error) {
                console.log('go to next question!');
                const thisKeyIndex = Service.questions.keys.indexOf(this.props.match.params.questionId);
                const nextKey = Service.questions.keys[thisKeyIndex + 1];
                console.log(Service.questions.keys, thisKeyIndex);
                if (nextKey) {
                    console.log('Next!', nextKey);
                    this.setState({
                        redirect: nextKey
                    });
                } else {
                    console.log('User done!');
                    this.props.history.push(`/finished`);
                }
            }
        });
    }

    getGameTimer(question) {
        let gameTimerSeconds = 100;
        switch(question.level) {
            case 0:
                gameTimerSeconds = Math.floor(Math.random() * 6) + 15;
                break;
            case 1:
                gameTimerSeconds = Math.floor(Math.random() * 6) + 10;
                break;
            case 2:
                gameTimerSeconds = Math.floor(Math.random() * 4) + 5;
                break;
        }
        this.originalGameTime = gameTimerSeconds;
        return Promise.resolve(gameTimerSeconds);
    }
    
    runGameTimer() {
        const intervalId = setInterval(() => {
            const newTimerSeconds = this.state.gameTimerSeconds - 1;
            this.setState({
                gameTimerSeconds: newTimerSeconds
            });
            clearInterval(intervalId);

            if ((newTimerSeconds / this.originalGameTime) <= 0.3) {
                this.timerClass = 'text-danger';
            } else if ((newTimerSeconds / this.originalGameTime) <= 0.6) {
                this.timerClass = 'text-warning';
            }

            if (newTimerSeconds === 0) {
                console.log('Abort! Next question!');
            } else {
                this.runGameTimer();
            }
        }, 1000);
    }
}

export default Question;
