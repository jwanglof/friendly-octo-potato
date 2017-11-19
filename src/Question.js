import React, { Component } from 'react';

class Question extends Component {
    constructor() {
        super();
        this.state = {
            currentItem: '',
        }
    }

    render() {
        return (
            <div className="text-left">
                <h3>Fråga: FOO</h3>
                <h5>Kategori: BAR</h5>
                <div className="form-check">
                    <label className="form-check-label">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1"/>
                        Option one is this and that&mdash;be sure to include why it's great
                    </label>
                </div>
                <div className="form-check">
                    <label className="form-check-label">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2"/>
                        Option two can be something else and selecting it will deselect option one
                    </label>
                </div>
                <div className="form-check">
                    <label className="form-check-label">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios3" value="option3"/>
                        Option three
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">Svara!</button>
            </div>
        );
    }
}

export default Question;
