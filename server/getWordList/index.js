const { getAllFBWords } = require('../shared/fbWordlist');

module.exports = async function (context, req) {
    context.log('Processing getWordList request.');

    const wordList = getAllFBWords();

    context.res = {
        status: 200,
        body: {
            success: true,
            wordList: wordList
        }
    };
};