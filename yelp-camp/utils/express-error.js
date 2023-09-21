class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode; // err.status || err.statusCode => Expressが自動的に res.statusCode の値としてくれる
    }
}

module.exports = ExpressError;