const { isValidFBWord } = require('../shared/fbWordlist');

module.exports = async function (context, req) {
    context.log('Processing validateWord request.');

    const word = (req.query.word || (req.body && req.body.word));

    if (!word) {
        context.res = {
            status: 400,
            body: {
                success: false,
                message: "Please pass a word on the query string or in the request body"
            }
        };
        return;
    }

    const isValid = isValidFBWord(word);

    context.res = {
        status: 200,
        body: {
            success: true,
            word: word,
            isValid: isValid
        }
    };
};