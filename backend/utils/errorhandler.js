// utils/errorhandler.js

/**
 * Error Handler - Untuk konsistensi response error
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {Number} status - HTTP status code (default: 500)
 * @param {String} message - Custom error message
 */
const errorHandler = (res, error, status = 500, message = "Terjadi kesalahan") => {
    // Log error untuk debugging
    console.error('=== ERROR LOG ===');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Message:', message);
    console.error('Error:', error);
    console.error('================');

    return res.status(status).json({
        success: false,
        message: message,
        error: error.message || error,
        timestamp: new Date().toISOString()
    });
};

module.exports = errorHandler;