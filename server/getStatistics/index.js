module.exports = async function (context, req) {
    context.log('Processing getStatistics request.');

    const gameResults = context.bindings.gameResults; // Data from Cosmos DB input binding

    if (!gameResults || gameResults.length === 0) {
        context.res = {
            status: 200,
            body: {
                totalGames: 0,
                winRate: 0,
                distribution: {},
                message: "No game results found."
            }
        };
        return;
    }

    let totalGames = gameResults.length;
    let totalWins = 0;
    const distribution = {};

    gameResults.forEach(result => {
        if (result.isWin) {
            totalWins++;
            const attempts = result.attempts || 6; // Default to 6 if attempts not recorded
            distribution[attempts] = (distribution[attempts] || 0) + 1;
        }
    });

    const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;

    context.res = {
        status: 200,
        body: {
            totalGames: totalGames,
            winRate: parseFloat(winRate.toFixed(2)),
            distribution: distribution
        }
    };
};