const { createProxyMiddleware } = require("http-proxy-middleware");

function apiPath() {
    let address = "http://localhost:4000";
    let override = process.env && process.env.PROXY_URI;
    return override || address;
}

const options = {
    target: apiPath(),
    ws: true,
    pathRewrite: {
        "^/websocket": "",
    }
}

const socketProxy = createProxyMiddleware("/websocket", options);

module.exports = function (app) {
    app.use(socketProxy);
};
