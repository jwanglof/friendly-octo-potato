import React, { Component } from 'react';
import firebase from './firebase';

class AddQuestion extends Component {
    firebaseQuestionsDb = firebase.database().ref('questions');
    firebaseAnswersDb = firebase.database().ref('answers');

    constructor() {
        super();
        this.state = this.getDefaultState();

        this.addQuestion = this.addQuestion.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <form onSubmit={this.addQuestion}>
                        <div className="form-group">
                            <label htmlFor="question">Fråga</label>
                            <input type="text" className="form-control" id="question" name="question" placeholder="Fråga" value={this.state.question} onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Kategori</label>
                            <input type="text" className="form-control" id="category" name="category" placeholder="Kategori" value={this.state.category} onChange={this.handleInputChange}/>
                        </div>

                        <h3>Svar</h3>

                        <div className="form-row">
                            <div className="form-group col-1 mt-4">
                                <input name="answer" type="radio" value="answerOneChecked" checked={this.state.answerSelected === 'answerOneChecked'} onChange={this.handleRadioChange} />
                            </div>
                            <div className="form-group col-11">
                                <label htmlFor="answerOne">Svar "Ett"</label>
                                <input type="text" className="form-control" id="answerOne" name="answerOne" placeholder="Ett" value={this.state.answerOne} onChange={this.handleInputChange}/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-1 mt-4">
                                <input name="answer" type="radio" value="answerCrossChecked" checked={this.state.answerSelected === 'answerCrossChecked'} onChange={this.handleRadioChange} />
                            </div>
                            <div className="form-group col-11">
                                <label htmlFor="answerCross">Svar "Kryss"</label>
                                <input type="text" className="form-control" id="answerCross" name="answerCross" placeholder="Kryss" value={this.state.answerCross} onChange={this.handleInputChange}/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-1 mt-4">
                                <input name="answer" type="radio" value="answerTwoChecked" checked={this.state.answerSelected === 'answerTwoChecked'} onChange={this.handleRadioChange} />
                            </div>
                            <div className="form-group col-11">
                                <label htmlFor="answerTwo">Svar "Två"</label>
                                <input type="text" className="form-control" id="answerTwo" name="answerTwo" placeholder="Två" value={this.state.answerTwo} onChange={this.handleInputChange}/>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Lägg till</button>
                    </form>
                </div>
            </div>
        );
    }

    handleRadioChange(event) {
        const target = event.target;
        const checked = target.checked;
        const value = target.value;

        // YUUUUUCK!
        if (value === 'answerOneChecked') {
            this.setState({
                answerCrossChecked: false,
                answerTwoChecked: false
            });
        } else if (value === 'answerCrossChecked') {
            this.setState({
                answerOneChecked: false,
                answerTwoChecked: false
            });
        } else if (value === 'answerTwoChecked') {
            this.setState({
                answerOneChecked: false,
                answerCrossChecked: false
            });
        }

        this.setState({
            answerSelected: value,
            [value]: checked
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    addQuestion(event) {
        event.preventDefault();
        const question = {
            question: this.state.question,
            category: this.state.category
        };
        const newQuestionRef = this.firebaseQuestionsDb.push(question, error => {
            if (!error) {
                // questionId: newQuestionRef.key,
                const answers = {
                    answerOne: this.state.answerOne,
                    answerCross: this.state.answerCross,
                    answerTwo: this.state.answerTwo,
                    correctAnswer: this.state.answerSelected,
                    numberOfShows: 0
                };
                this.firebaseAnswersDb.child(newQuestionRef.key).set(answers, error => {
                    if (!error) {
                        this.setState(this.getDefaultState());
                    }
                });
                // this.firebaseAnswersDb.push(answers, error => {
                //     if (!error) {
                //         this.setState(this.getDefaultState());
                //     }
                // })
            }
        });
    }

    getDefaultState() {
        return {
            question: '',
            category: '',
            answerOne: '',
            answerOneChecked: false,
            answerCross: '',
            answerCrossChecked: false,
            answerTwo: '',
            answerTwoChecked: false,
            answerSelected: ''
        };
    }
}

export default AddQuestion
