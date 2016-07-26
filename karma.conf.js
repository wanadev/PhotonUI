module.exports = function(config) {
    var cfg = {
        frameworks: ["jasmine"],
        files: [
            "dist/photonui.js",
            "dist/photonui-base.css",
            "dist/photonui-theme-particle.css",
            "test/helpers.js",
            "test/style.css",
            "test/spec/**/*.js", {
                pattern: "test/*.png",
                watched: false,
                included: false,
                served: true
            }
        ],
        proxies: {
            "/test/": "/base/test/"
        },
        reporters: ["spec"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ["Firefox", "Chrome"],
        captureTimeout: 60000,
        singleRun: true,

        customLaunchers: {
            Chrome_travis_ci: {
                base: "Chrome",
                flags: ["--no-sandbox"]
            }
        }
    };

    if (process.env.TRAVIS) {
        cfg.browsers = ["Firefox", "Chrome_travis_ci"];
    }

    config.set(cfg);
};
