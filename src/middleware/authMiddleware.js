export const authMiddleware = (token) => {
    return (next) => {
        return async (url, config) => {
            const newConfig = {
                ...config,
                headers: {
                    ...(config.headers || {}),
                    'Authorization': `Bearer ${token}`
                }
            };
            
            try {
                return await next(url, newConfig);
            } catch (error) {
                console.error('Error de autenticación', error.message);
                throw error;
            }
        };
    };
};