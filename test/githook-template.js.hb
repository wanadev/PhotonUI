var exec = require("child_process").exec;

var COMMAND = "{{escapeBackslashes command}}{{#if task}} {{escapeBackslashes task}}{{/if}}{{#if args}} {{{escapeBackslashes args}}}{{/if}}";
var MSG_CHECKING = "\n\x1B[1;33m \\_°< \x1B[0m\x1B[1m I'm checking your code, please wait...\x1B[0m";
var MSG_OK = "\r\x1B[1;32m \\_^> \x1B[0m\x1B[1m Everything is ok, good job!           \x1B[0m\n";
var MSG_ERROR = "\x1B[1;31m \\_×< \x1B[0m\x1B[1m Oops, there is something wrong!\n";

process.stdout.write(MSG_CHECKING);

exec(COMMAND, {
    cwd: "{{escapeBackslashes gruntfileDirectory}}"
}, function (err, stdout, stderr) {

    var exitCode = 0;

    if (err) {
        process.stdout.write("\r                                               \r");
        console.log(stdout);
        console.log(MSG_ERROR);
        exitCode = -1;
    } else {
        console.log(MSG_OK);
    }

    {{#unless preventExit}}
    process.exit(exitCode);
    {{/unless}}
});
