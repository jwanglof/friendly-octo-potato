const {EventEmitter} = require('fbemitter');

module.exports = {
    constants: {
        introHidden: 'intro-hidden',
        allQuestionsFetched: 'all-questions-fetched'
    },
    emitter: new EventEmitter()
};
