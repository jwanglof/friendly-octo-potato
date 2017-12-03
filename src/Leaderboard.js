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
            players: []
        };
    }

    componentDidMount() {
        this.firebasePlayersDb.once('value')
            .then(playersSnapshot => {
                this.players = playersSnapshot.val();
                if (this.players && Object.keys(this.players).length > 0) {
                    return this.firebaseQuestionsDb.once('value');
                } else {
                    throw new Error('No players... :(');
                }
            })
            .then(questionsSnapshot => {
                this.questions = questionsSnapshot.val();
                return this.firebaseAnswersDb.once('value');
            })
            .then(answersSnapshot => {
                this.answers = answersSnapshot.val();

                for (let pKey of Object.keys(this.players)) {
                    const player = this.players[pKey];
                    player.correctAnswers = 0;
                    if (player.answers) {
                        for (let aKey of player.answers) {
                            const question = this.questions[aKey.questionId];
                            const answer = this.answers[aKey.questionId];
                            if (question && answer && aKey.chosenAnswer === answer.correctAnswer) {
                                player.correctAnswers++;
                            }
                        }
                    }
                }
                return this.sortPlayerByCorrectAnswers(this.players);
            })
            .then(sortedPlayers => {
                const sortedPlayerList = [];
                for (let p of sortedPlayers) {
                    sortedPlayerList.push(this.players[p]);
                }
                this.setState({
                    players: sortedPlayerList
                });
            })
            .catch(err => {
                console.error('NOOOO:', err);
            });
    }

    sortPlayerByCorrectAnswers(players) {
        return new Promise(resolve => {
            const sorted = Object.keys(players)
                .sort((a, v) => {
                    return players[v].correctAnswers - players[a].correctAnswers;
                });
            resolve(sorted);
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
                            <th scope="col">Antal rätt</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.keys(this.state.players).map(key => {
                            return (
                                <tr key={key}>
                                    <th>{this.state.players[key].name || 'Foo Bar'}</th>
                                    <td><Timestamp time={this.state.players[key].created / 1000}/></td>
                                    <td>{this.state.players[key].correctAnswers}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Leaderboard;