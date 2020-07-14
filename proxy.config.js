const PROXY_CONFIG = {
    "/api/*": {
        "target": 'https://w-api-dev.herokuapp.com',
        router: function(req) {
            var target = 'https://w-api-dev.herokuapp.com'; // or some custom code
            return target;
        },
        "changeOrigin": true,
        "secure": false,
        "logLevel": "debug",
        "pathRewrite": {
            "^/api": ""
        },
        "changeOrigin": true
    }
};

module.exports = PROXY_CONFIG;