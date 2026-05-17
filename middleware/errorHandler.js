const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if(err.isJoi) {
        return res.status(400).json({ 
            message: 'Validation error', 
            details: err.details[0].message 
        });
    }
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong on the server!'
    });
};
module.exports = errorHandler;