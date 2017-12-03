const {EventEmitter} = require('fbemitter');

module.exports = {
    constants: {
        introHidden: 'intro-hidden',
        allQuestionsFetched: 'all-questions-fetched',
        nameChanged: 'name-changed',
        noQuestionsFetched: 'no-questions-fetched'
    },
    emitter: new EventEmitter()
};
