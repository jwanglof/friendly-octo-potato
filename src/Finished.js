import React, { Component } from 'react';
import firebase from './firebase';

class Finished extends Component {
    firebaseQuestionsDb = firebase.database().ref('questions');

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    Finished!!
                </div>
            </div>
        );
    }
}

export default Finished;