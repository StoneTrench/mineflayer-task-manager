import { Bot } from "mineflayer";

declare module "mineflayer" {
    interface Bot {
        /**
         * Add an action to the task queue.
         * @param name The name of the action use it to distinguish it from the rest.
         * @param action the promise based function to execute when we get to it.
         * @param delay the time in ms to wait before executing the action, set to 0 by default.
         */
        taskManager_Add: (name: string, action: (bot: Bot) => Promise<any>, delay?: number) => void;
        /**
         * Add an action to the start of the task queue.
         * @param name The name of the action use it to distinguish it from the rest.
         * @param action the promise based function to execute when we get to it.
         * @param delay the time in ms to wait before executing the action, set to 0 by default.
         */
        taskManager_Insert: (name: string, action: (bot: Bot) => Promise<any>, delay?: number) => void;
        /**
         * Remove an action from the queue.
         * @param name The name of the action use it to distinguish it from the rest.
         */
        taskManager_Remove: (name: string) => void;
        /**
         * Get an action from the queue.
         * @param index the index of the task, set to 0 by default.
         */
        taskManager_Get: (index?: number) => BotTask;
        /**
         * Get the queue.
         */
        taskManager_GetWholeQueue: () => BotTask[];
    }
}

class BotTask {
    name: string;
    action: (bot: Bot) => Promise<any>;
    delay: number;

    constructor(name, action, delay = 0) {
        this.name = name;
        this.action = action;
        this.delay = delay;
    }
}

export default function Plugin(bot: Bot) {
    const taskQueue: BotTask[] = [];

    bot.taskManager_Add = (name, action, delay = 0) => {
        taskQueue.push(new BotTask(name, action, delay))
    }
    bot.taskManager_Insert = (name, action, delay = 0) => {
        taskQueue.unshift(new BotTask(name, action, delay))
    }
    bot.taskManager_Remove = (name) => {
        taskQueue.splice(taskQueue.findIndex(e => e.name == name), 1);
    }

    bot.taskManager_Get = (index = 0) => { return taskQueue[index]; }
    bot.taskManager_GetWholeQueue = () => { return [...taskQueue] }

    let IsWorking = false;
    bot.on("physicsTick", () => {
        if (!IsWorking && taskQueue.length > 0) {
            IsWorking = true;
            const currentTask = taskQueue[0];
            waitFor(currentTask.delay).finally(() => {
                currentTask.action(bot).finally(() => {
                    IsWorking = false
                });
            });
            taskQueue.splice(0, 1);
        }
    })
}

function waitFor(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}