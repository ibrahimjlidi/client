const customFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['x-auth-token'] = token;
    }

    const response = await fetch(url, { ...options, headers });
    return response;
};

export default customFetch; 