const ErrorHandler = (error, req, res, next) => {
    const status = error.status || 500;
    return res.status(status).json({
        status: status,
        error: error.message || 'Oops something went wrong'
    })
}

export default ErrorHandler