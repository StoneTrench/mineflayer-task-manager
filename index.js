"use strict";
exports.__esModule = true;
//#endregion
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
    var currentTask = null;
    bot.taskManager = {};
    bot.taskManager.Add = function (name, action, delay) {
        if (delay === void 0) { delay = 0; }
        taskQueue.push(new BotTask(name, action, delay));
    };
    bot.taskManager.Insert = function (name, action, delay) {
        if (delay === void 0) { delay = 0; }
        taskQueue.unshift(new BotTask(name, action, delay));
    };
    bot.taskManager.InsertAt = function (index, name, action, delay) {
        if (delay === void 0) { delay = 0; }
        var half = taskQueue.slice(0, index);
        half.push(new BotTask(name, action, delay));
        taskQueue = half.concat(taskQueue.slice(index));
    };
    bot.taskManager.Remove = function (name) {
        var index = taskQueue.findIndex(function (e) { return e.name == name; });
        if (index != -1)
            taskQueue.splice(index, 1);
    };
    bot.taskManager.Removef = function (predicate) {
        taskQueue = taskQueue.filter(predicate);
    };
    bot.taskManager.Clear = function () {
        taskQueue = [];
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
            currentTask = taskQueue.shift(); // Since if all is well this will never set it to null;
            if (currentTask.delay > 0) {
                waitFor(currentTask.delay)["finally"](function () {
                    CompleteTask();
                });
            }
            else {
                CompleteTask();
            }
        }
    });
    function CompleteTask() {
        var btsk = currentTask;
        if (btsk.action == null)
            return new Error(btsk.name + " BotTask action was null!");
        var res = btsk.action(bot); // This shouldn't ever be null;
        if (res && res["finally"])
            res["finally"](function () {
                //currentTask = null;
                IsWorking = false;
            });
        else {
            //currentTask = null;
            IsWorking = false;
        }
    }
}
exports.taskManager = taskManager;
function waitFor(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
