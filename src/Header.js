import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import Jumbotron from './Jumbotron';

class Header extends Component {
    render() {
        return (
            <header>
                <nav className="nav justify-content-center">
                    <Link className="nav-link" to="/">Introduktion</Link>
                    {/*<Link className="nav-link" to="/add-question">Add question</Link>*/}
                    <Link className="nav-link" to="/all-questions">Alla frågor</Link>
                    <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
                </nav>
                <Jumbotron {...this.props} />
            </header>
        );
    }
}

export default Header
