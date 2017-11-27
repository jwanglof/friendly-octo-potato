import React, { Component } from 'react';
import firebase from './firebase';
// import Service from './Service';
// import Events from './Events';
const Timestamp = require('react-timestamp');

class Leaderboard extends Component {
    firebaseQuestionsDb = firebase.database().ref('questions');
    firebasePlayersDb = firebase.database().ref('players');
    firebaseAnswersDb = firebase.database().ref('answers');
    questions = {};
    players = {};
    answers = {};

    constructor() {
        super();

        this.state = {
            players: {}
        };
    }

    componentDidMount() {
        console.log(1);
        this.firebasePlayersDb.once('value')
            .then(playersSnapshot => {
                console.log(1);
                this.players = playersSnapshot.val();
                console.log(1);
                return this.firebaseQuestionsDb.once('value');
            })
            .then(questionsSnapshot => {
                this.questions = questionsSnapshot.val();
                console.log(1);
                return this.firebaseAnswersDb.once('value');
            })
            .then(answersSnapshot => {
                this.answers = answersSnapshot.val();
                console.log(1);

                for (let pKey of Object.keys(this.players)) {
                    const player = this.players[pKey];
                    player.correctAnswers = 0;
                    for (let aKey of player.answers) {
                        const question = this.questions[aKey.questionId];
                        const answer = this.answers[aKey.questionId];
                        console.log(aKey, question, answer);
                        if (question && answer && aKey.chosenAnswer === answer.correctAnswer) {
                            console.log(aKey, question, answer);

                        }
                    }
                }
            })
            .catch(err => {
                console.error('NOOOO:', err);
            });
    }

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">Namn</th>
                            <th scope="col">Skapad</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.keys(this.state.players).map(key => {
                            return (
                                <tr key={key}>
                                    <th>{this.state.players[key].name}</th>
                                    <td><Timestamp time={this.state.players[key].created / 1000}/></td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    fetchAnswersForQuestion() {

    }
}

export default Leaderboard;