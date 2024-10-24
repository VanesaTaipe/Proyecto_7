export const loggingMiddleware = (next) => async (url, config) => {
    console.log(`[${new Date().toISOString()}] Request:`, {
        url,
        method: config.method
    });

    try {
        const response = await next(url, config);
        console.log(`[${new Date().toISOString()}] Response:`, {
            status: response.status
        });
        return response;
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error:`, error);
        throw error;
    }
};