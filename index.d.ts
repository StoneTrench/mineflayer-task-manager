import { Bot } from "mineflayer";

declare module "mineflayer-task-manager"{
    export function taskManager(bot: Bot): void;
}
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
             * You can define an array of actions, and insert them to the start of the queue while they keep their order the same way they are in the actions array.
             * @param name Either a name that it will assign to each action, or an array of names with the same length as the actions array that it will pair up with the actions.
             * @param actions The list of Actions to either insert at the start of the queue, or add at the end of the queue.
             * @param add Incase you want to add the actions to the end of queue instead of inserting them. Set to false by default.
             * @param delays An array containing all the delays for each of the tasks, which will get paired up like the names. Set to an empty array my default.
             */
            InsertQueue: (name: string | string[], actions: Action[], add?: boolean, delays?: number[]) => void; 
            /**
             * Add an action at the index of the task queue. Moves the element already at the index by +1 and so on.
             * @param index The index where the action should go.
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
             * Get a task from the queue.
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


/**
 * Task class.
 */
declare class BotTask {
    /**
     * The name of the action use it to distinguish it from the rest.
     */
    name: string;
    /**
     * the promise/void based function to execute when we get to it.
     */
    action: Action;
    /**
     * The time in ms to wait before executing the action, set to 0 by default.
     */
    delay: number;

    constructor(name: string, action: Action, delay?: number);
}