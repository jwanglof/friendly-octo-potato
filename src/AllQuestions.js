import React, {Component} from 'react';
import firebase from './firebase';

class AllQuestions extends Component {
    firebaseQuestionsDb = firebase.database().ref('questions');

    constructor(props) {
        super(props);
        this.fetchAllQuestions = this.fetchAllQuestions.bind(this);

        this.state = {
            questions: []
        };
    }

    componentDidMount() {
        this.fetchAllQuestions();
    }

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Fråga</th>
                                <th scope="col">Kategori</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(this.state.questions).map(key => {
                                return (
                                    <tr key={key}>
                                        <th>{this.state.questions[key].question}</th>
                                        <td>{this.state.questions[key].category}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    fetchAllQuestions() {
        this.firebaseQuestionsDb.once('value', snapshot => {
            this.setState({
                questions: snapshot.val()
            })
        });
    }
}

export default AllQuestions;