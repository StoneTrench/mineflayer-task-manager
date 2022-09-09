"use strict";
exports.__esModule = true;
var BotTask = /** @class */ (function () {
    function BotTask(name, action, delay) {
        if (delay === void 0) { delay = 0; }
        this.name = name;
        this.action = action;
        this.delay = delay;
    }
    return BotTask;
}());
function Plugin(bot) {
    var taskQueue = [];
    bot.taskManager_Add = function (name, action, delay) {
        if (delay === void 0) { delay = 0; }
        taskQueue.push(new BotTask(name, action, delay));
    };
    bot.taskManager_Insert = function (name, action, delay) {
        if (delay === void 0) { delay = 0; }
        taskQueue.unshift(new BotTask(name, action, delay));
    };
    bot.taskManager_Remove = function (name) {
        taskQueue.splice(taskQueue.findIndex(function (e) { return e.name == name; }), 1);
    };
    bot.taskManager_Get = function (index) {
        if (index === void 0) { index = 0; }
        return taskQueue[index];
    };
    bot.taskManager_GetWholeQueue = function () { return taskQueue.slice(); };
    var IsWorking = false;
    bot.on("physicsTick", function () {
        if (!IsWorking && taskQueue.length > 0) {
            IsWorking = true;
            var currentTask_1 = taskQueue[0];
            waitFor(currentTask_1.delay)["finally"](function () {
                currentTask_1.action(bot)["finally"](function () {
                    IsWorking = false;
                });
            });
            taskQueue.splice(0, 1);
        }
    });
}
exports.Plugin = Plugin;
function waitFor(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
