const PROXY_CONFIG = {
    "/v1/*": {
        target: 'https://w-api-dev.herokuapp.com',
        router: function(req) {
            var target = 'https://w-api-dev.herokuapp.com';
            return target;
        },
        changeOrigin: true,
        secure: false,
        logLevel: "debug"
    }
};

module.exports = PROXY_CONFIG;