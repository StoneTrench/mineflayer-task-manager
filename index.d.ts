import { Bot, BotOptions } from "mineflayer";

declare module "mineflayer" {
    interface Bot {
        /**
         * Add an action to the task queue.
         * @param name The name of the action use it to distinguish it from the rest.
         * @param action The promise based function to execute when we get to it.
         * @param delay The time in ms to wait before executing the action, set to 0 by default.
         */
        taskManager_Add: (name: string, action: (bot: Bot) => Promise<any>, delay?: number) => void;
        /**
         * Add an action to the start of the task queue.
         * @param name The name of the action use it to distinguish it from the rest.
         * @param action The promise based function to execute when we get to it.
         * @param delay The time in ms to wait before executing the action, set to 0 by default.
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

/**
 * Task class.
 */
declare class BotTask {
    /**
     * The name of the action use it to distinguish it from the rest.
     */
    name: string;
    /**
     * The promise based function to execute when we get to it.
     */
    action: (bot: Bot) => Promise<any>;
    /**
     * The time in ms to wait before executing the action, set to 0 by default.
     */
    delay: number;

    constructor(name: string, action: Promise<any>, delay?: number);
}

declare function Plugin(bot: Bot, options: BotOptions)