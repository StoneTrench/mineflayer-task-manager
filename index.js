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
function taskManager(bot) {
    var taskQueue = [];
    var paused = false;
    bot.taskManager = {};
    bot.taskManager.Add = function (name, action, delay) {
        if (delay === void 0) { delay = 0; }
        taskQueue.push(new BotTask(name, action, delay));
    };
    bot.taskManager.Insert = function (name, action, delay) {
        if (delay === void 0) { delay = 0; }
        taskQueue.unshift(new BotTask(name, action, delay));
    };
    bot.taskManager.Remove = function (name) {
        var index = taskQueue.findIndex(function (e) { return e.name == name; });
        if (index != -1)
            taskQueue.splice(index, 1);
    };
    bot.taskManager.Clear = function () {
        taskQueue.splice(0);
    };
    bot.taskManager.Pause = function () {
        paused = true;
    };
    bot.taskManager.Resume = function () {
        paused = false;
    };
    bot.taskManager.Get = function (index) {
        if (index === void 0) { index = 0; }
        return taskQueue[index];
    };
    bot.taskManager.GetWholeQueue = function () { return taskQueue.slice(); };
    var IsWorking = false;
    bot.on("physicsTick", function () {
        if (!IsWorking && taskQueue.length > 0 && !paused) {
            IsWorking = true;
            var currentTask_1 = taskQueue[0];
            waitFor(currentTask_1.delay)["finally"](function () {
                var res = currentTask_1.action(bot);
                if (res)
                    res["finally"](function () { IsWorking = false; });
                else
                    IsWorking = false;
            });
            taskQueue.splice(0, 1);
        }
    });
}
exports.taskManager = taskManager;
function waitFor(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
