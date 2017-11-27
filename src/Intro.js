import React, { Component } from 'react';
import Service from './Service';
import Events from './Events';

class Intro extends Component {
    constructor(props) {
        super(props);
        this.gotoQuestion = this.gotoQuestion.bind(this);
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
                        Jag fick förfrågan att göra något roligt till D-Sektionens julkalender så kom upp med detta lilla spel. Om jag ska vara ärlig så har jag gjort detta spel främst för att lära mig mer ReactJS integrerat med Firebase Real-tids DB ;)
                        <br/>
                        Spelet går ut på att svara på frågor helt enkelt. Frågorna är programmeringsrelaterade, såklart, och du kommer ha mindre och mindre tid på dig att svara per fråga. På de fem första frågorna har du mellan 15-25 sekunder (är lite randomiserat, såklart!), på fråga fem t.o.m tio har du 10-15 sekunder och på de sista 5 har du mellan 5-7 sekunder per fråga.
                        <br/>
                        Om du inte hinner svara på frågan innan tidsspannet är slut skickas du vidare till nästa fråga.
                        <br/>
                        Efter sista frågan kommer du komma till ett formulär där du kan skriva in ditt namn (om du vill!). Kommer finna ett leader-board där du kan se hur bra du ligger till :)
                    </span>
                    <h3>PS. Jag har sparat en cookie som spar ditt UID. Om du inte är OK med det så måste du tyvärr stänga ner denna eminenta hemsida!</h3>
                </div>
                <div className="col-12 text-center">
                    <button className="btn btn-dark" onClick={this.gotoQuestion}>Fortsätt till frågorna!</button>
                </div>
            </div>
        );
    }

    gotoQuestion() {
        if (Service.questions && Service.questions.keys) {
            this.props.history.push(`/question/${Service.questions.keys[0]}`);
        } else {
            setTimeout(() => {
                this.gotoQuestion();
            }, 500);
        }
    }
}

export default Intro;