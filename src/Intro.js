import React, { Component } from 'react';
import Service from './Service';
import Events from './Events';

class Intro extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showButton: false,
            showNewGameText: false
        };

        this.gotoQuestion = this.gotoQuestion.bind(this);

        Events.emitter.addListener(Events.constants.noQuestionsFetched, () => {
            this.setState({
                showNewGameText: true
            });
        });

        Events.emitter.addListener(Events.constants.allQuestionsFetched, () => {
            console.log(444);
            this.setState({
                showButton: true
            });
        });
    }

    componentWillUnmount() {
        Events.emitter.emit(Events.constants.introHidden);
    }

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <h1 className="display-4">Men tjena!</h1>
                    <span className="lead">
                        Jag heter Wäggen men kallas Johan ibland, beror lite på känslan som infinner sig när man träffar mig (om det vill sig riktigt väl så kan det blir Dräggen också, men det kan vi ta när vi träffs!).
                    </span>
                    <span className="d-block">
                        Jag är en C/D-alumn som gick IP-programmet mellan 2011 och 2016, tycker det är rimligt att göra ett 3-årsprogram på 5 år. Eloge till er som pluggar 5år och är i fas ;)
                        <br/>
                        Under min tid på LiU hann jag med en del:
                        <ul>
                            <li>2012-2013, dryckesansvarig i CC (C-sektionens festeri), C30-general, vimmelfotograf på HG/Kårallen</li>
                            <li>2013-2014, STABEN (MacStaben), vimmelfotograf på HG/Kårallen</li>
                            <li>2014-2015, kassör C-sektionen, vimmelfotograf på HG/Kårallen</li>
                        </ul>
                        Nuförtiden hänger jag i Karlstad och är konsult på ÅF. Sitter som frontendansvarig för Hertz Norden (biluthyrning). Flyttade hit under andra halvan av 2016 för att min dåvarande fästmö (nu fru) kom in på Karlstads Universitet.
                    </span>
                    <span className="d-block">
                        Jag fick förfrågan att göra något roligt till D-Sektionens julkalender så kom upp med detta lilla spel. Om jag ska vara ärlig så har jag gjort detta spel främst för att lära mig mer ReactJS integrerat med Firebase realtids DB ;)
                        <br/>
                        Spelet går ut på att svara på frågor helt enkelt. Frågorna är jävligt random och du kommer ha mindre och mindre tid på dig att svara per fråga. På de fem första frågorna har du mellan 15-20 sekunder (är lite randomiserat, såklart!), på fråga fem t.o.m tio har du 10-15 sekunder och på de sista 5 har du mellan 5-7 sekunder per fråga.
                        <br/>
                        Om du inte hinner svara på frågan innan tidsspannet är slut skickas du vidare till nästa fråga.
                        <br/>
                        Efter sista frågan kommer du komma till ett formulär där du kan skriva in ditt namn (om du vill!). Kommer finna ett leader-board där du kan se hur bra du ligger till :)
                    </span>
                    <h3>PS. Jag har sparat en cookie som spar ditt UID. Om du inte är OK med det så måste du tyvärr stänga ner denna eminenta hemsida!</h3>
                    <h5>PPS. Jag kan inte garantera att detta spel fungerar helt 100%, såååå, lycka till ;D</h5>
                </div>
                <div className="col-12 text-center">
                    <button className="btn btn-dark" onClick={this.gotoQuestion} hidden={!this.state.showButton}>Fortsätt till frågorna!</button>
                </div>
                <div className="col-12 text-center" hidden={!this.state.showNewGameText}>
                    <h3>Det ser ut som att du redan har spelat, kul!</h3>
                    Om du vill spela en gång till kan du bara ta bort kakan som heter "alumni-game-cookie" och ladda om sidan :)
                </div>
            </div>
        );
    }

    gotoQuestion() {
        // console.log(123, Service.questions);
        // if (Service.questions && Service.questions.keys) {
            this.props.history.push(`/question/${Service.questions.keys[0]}`);
        // } else {
        //     setTimeout(() => {
        //         this.gotoQuestion();
        //     }, 500);
        // }
    }
}

export default Intro;