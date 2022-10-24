import { Bot } from "mineflayer";

//#region Just copy this part from the index.d.ts
declare type Action = ((bot: Bot) => void | Promise<void>)
declare module "mineflayer" {
    interface Bot {
        taskManager: {
            /**
             * Add an action to the task queue.
             * @param name The name of the action use it to distinguish it from the rest.
             * @param action the promise/void based function to execute when we get to it.
             * @param delay the time in ms to wait before executing the action, set to 0 by default.
             */
            Add: (name: string, action: Action, delay?: number) => void;
            /**
             * Add an action to the start of the task queue.
             * @param name The name of the action use it to distinguish it from the rest.
             * @param action the promise/void based function to execute when we get to it.
             * @param delay the time in ms to wait before executing the action, set to 0 by default.
             */
            Insert: (name: string, action: Action, delay?: number) => void;
            /**
             * Add an action at the index of the task queue. Moves the element already at the index by +1 and so on.
             * @param index The index where the task should go.
             * @param name The name of the action use it to distinguish it from the rest.
             * @param action the promise/void based function to execute when we get to it.
             * @param delay the time in ms to wait before executing the action, set to 0 by default.
             */
            InsertAt: (index: number, name: string, action: Action, delay?: number) => void;
            /**
             * Remove an action from the queue.
             * @param name The name of the action use it to distinguish it from the rest.
             */
            Remove: (name: string) => void;
            /**
             * Remove all the tasks for which the predicate returned false, from the queue.
             * @param predicate Basically the filter.
             */
            Removef: (predicate: (task: BotTask, index: number, queue: BotTask[]) => boolean) => void;
            /**
             * Get an action from the queue.
             * @param index the index of the task, set to 0 by default.
             * @returns The bot task at the index.
             */
            Get: (index?: number) => BotTask;
            /**
             * Get the queue.
             * @returns The whole queue.
             */
            GetWholeQueue: () => BotTask[];
            /**
             * Removes every element from the queue.
             */
            Clear: () => void;
            /**
             * Stops executing tasks in the queue.
             */
            Pause: () => void;
            /**
             * Resumes executing tasks in the queue.
             */
            Resume: () => void;
        }
    }
}
//#endregion

class BotTask {
    name: string;
    action: Action;
    delay: number;

    constructor(name: string, action: Action, delay: number = 0) {
        this.name = name;
        this.action = action;
        this.delay = delay;
    }
}

export function taskManager(bot: Bot) {
    let taskQueue: BotTask[] = [];
    let paused = false;
    let currentTask: BotTask | null = null;

    bot.taskManager = {} as any;

    bot.taskManager.Add = (name, action, delay = 0) => {
        taskQueue.push(new BotTask(name, action, delay))
    }
    bot.taskManager.Insert = (name, action, delay = 0) => {
        taskQueue.unshift(new BotTask(name, action, delay))
    }
    bot.taskManager.InsertAt = (index, name, action, delay = 0) => {
        const half = taskQueue.slice(0, index);
        half.push(new BotTask(name, action, delay))
        taskQueue = half.concat(taskQueue.slice(index))
    }
    bot.taskManager.Remove = (name) => {
        let index = taskQueue.findIndex(e => e.name == name);
        if (index != -1)
            taskQueue.splice(index, 1);
    }
    bot.taskManager.Removef = (predicate) => {
        taskQueue = taskQueue.filter(predicate)
    }
    bot.taskManager.Clear = () => {
        taskQueue = [];
    }
    bot.taskManager.Pause = () => {
        paused = true;
    }
    bot.taskManager.Resume = () => {
        paused = false;
    }

    bot.taskManager.Get = (index = 0) => { return taskQueue[index]; }
    bot.taskManager.GetWholeQueue = () => { return [...taskQueue] }

    let IsWorking = false;
    bot.on("physicsTick", () => {
        if (!IsWorking && taskQueue.length > 0 && !paused) {
            IsWorking = true;
            currentTask = taskQueue.shift() as BotTask; // Since if all is well this will never set it to null;
            if (currentTask.delay > 0) {
                waitFor(currentTask.delay).finally(() => {
                    CompleteTask();
                });
            }
            else {
                CompleteTask();
            }
        }
    });

    function CompleteTask() {
        var btsk = (currentTask as BotTask);
        if (btsk.action == null) return new Error(`${btsk.name} BotTask action was null!`)
        var res = btsk.action(bot); // This shouldn't ever be null;
        if (res && res.finally) res.finally(() => {
            currentTask = null;
            IsWorking = false
        });
        else {
            currentTask = null;
            IsWorking = false
        }
    }
}

function waitFor(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}