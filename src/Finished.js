import React, { Component } from 'react';
import firebase from './firebase';
import Service from './Service';
import Events from './Events';
import {Link} from "react-router-dom";
const random_name = require('node-random-name');

class Finished extends Component {
    firebaseQuestionsDb = firebase.database().ref('questions');
    firebasePlayersDb = firebase.database().ref('players');

    constructor() {
        super();
        this.state = {
            questions: [],
            name: '',
            submitNameButtonText: 'Klicka här för att lägga till ditt namn',
            submitNameButtonEnabled: true
        };

        this.changeRandomName = this.changeRandomName.bind(this);
        this.changeName = this.changeName.bind(this);
        this.submitName = this.submitName.bind(this);
    }

    componentDidMount() {
        this.firebaseQuestionsDb.once('value', snapshot => {
        });
        this.firebasePlayersDb.child(Service.getUuid()).once('value', snapshot => {
            this.setState({
                name: snapshot.val().name
            });
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <h1 className="display-2">Men grattis!</h1>
                    <h4 className="display-4">Kul att du kom såhär långt</h4>
                    <span className="lead">
                        Hoppas att spelet fungerade hyffsat bra iaf, jag gjorde detta under några kvällar för att jag fick en fråga från Fluff om jag ville vara med i en lucka i julkalendern (hur kan man säga nej till det, och till the Dude?). Har lärt mig lite mer React under tiden vilket varit roligt.
                    </span>
                    <span className="d-block">
                        Som du kanske märker är du inne på https://alumni.botillsammans.nu och du kanske fick några frågor om oss också, men tänkte ändå skriva lite reklam här om oss: Bla bla bla bla bla
                    </span>
                    <span className="d-block">
                        Du kan trycka här för att komma till ett sorts leaderboard, och du får jätte-jätte-jättegärna fylla i ditt "namn" i detta formulär för att kunna visa hur bäst du egentligen är mot de andra som lekt i detta spel (om du inte gör det så kommer din användare heta "<i>{this.state.name}</i>").
                        <br/>
                        Om du vill göra om spelet med en ny användare så är det bara att ta bort kakan som heter "alumni-game-cookie" och ladda om sidan :)
                        <br/>
                    </span>
                    {
                        !this.state.submitNameButtonEnabled ?
                            <span className="d-block mt-2 mb-2">
                                <Link className="nav-link" to="/leaderboard">Tryck här för att komma till leaderboarden</Link>
                            </span> : null
                    }
                    <span className="d-block">
                        <form onSubmit={this.submitName}>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="'Namn'" value={this.state.name} onChange={this.changeName} disabled={!this.state.submitNameButtonEnabled}/>
                            </div>
                            <div className="btn-toolbar">
                                <div className="btn-group">
                                    <button type="submit" className="btn btn-primary mr-2" disabled={!this.state.submitNameButtonEnabled}>{this.state.submitNameButtonText}</button>
                                </div>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-primary" onClick={this.changeRandomName}>Få nytt namn</button>
                                </div>
                            </div>
                        </form>
                    </span>
                </div>
            </div>
        );
    }

    changeName(event) {
        event.preventDefault();

        const target = event.target;
        const value = target.value;
        this.setState({
            name: value
        });
    }

    changeRandomName() {
        this.setState({
            name: random_name()
        });
    }

    submitName(event) {
        event.preventDefault();

        console.log(this.state.name);
        const playerRef = this.firebasePlayersDb.child(`${Service.getUuid()}`);
        playerRef.update({name: this.state.name})
            .then(error => {
                if (!error) {
                    this.setState({
                        submitNameButtonText: 'Namn sparat, kul!',
                        submitNameButtonEnabled: false
                    });
                    Events.emitter.emit(Events.constants.nameChanged, this.state.name);
                }
            });
    }
}

export default Finished;