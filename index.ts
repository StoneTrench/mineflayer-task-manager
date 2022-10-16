import { Bot } from "mineflayer";

declare module "mineflayer" {
    interface Bot {
        taskManager: {
            /**
             * Add an action to the task queue.
             * @param name The name of the action use it to distinguish it from the rest.
             * @param action the promise based function to execute when we get to it.
             * @param delay the time in ms to wait before executing the action, set to 0 by default.
             */
            Add: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void;
            /**
             * Add an action to the start of the task queue.
             * @param name The name of the action use it to distinguish it from the rest.
             * @param action the promise based function to execute when we get to it.
             * @param delay the time in ms to wait before executing the action, set to 0 by default.
             */
            Insert: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void;
            /**
             * Remove an action from the queue.
             * @param name The name of the action use it to distinguish it from the rest.
             */
            Remove: (name: string) => void;
            /**
             * Get an action from the queue.
             * @param index the index of the task, set to 0 by default.
             */
            Get: (index?: number) => BotTask;
            /**
             * Get the queue.
             */
            GetWholeQueue: () => BotTask[];
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
    let paused = false;

    bot.taskManager = {} as any;

    bot.taskManager.Add = (name, action, delay = 0) => {
        taskQueue.push(new BotTask(name, action, delay))
    }
    bot.taskManager.Insert = (name, action, delay = 0) => {
        taskQueue.unshift(new BotTask(name, action, delay))
    }
    bot.taskManager.Remove = (name) => {
        taskQueue.splice(taskQueue.findIndex(e => e.name == name), 1);
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
            const currentTask = taskQueue[0];
            waitFor(currentTask.delay).finally(() => {
                var res = currentTask.action(bot);
                if (res) res.finally(() => { IsWorking = false });
                else IsWorking = false
            });
            taskQueue.splice(0, 1);
        }
    })
}

function waitFor(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}