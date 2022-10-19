# mineflayer-task-manager

A mineflayer task queue manager. It's promise based, but you can also use non async functions in the queue.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


  - [Installation](#installation)
  - [Usage](#usage)
- [Api documentation](#api-documentation)
      - [Add: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void](#add-name-string-action-bot-bot--promiseany--void-delay-number--void)
      - [Insert: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void](#insert-name-string-action-bot-bot--promiseany--void-delay-number--void)
      - [GetWholeQueue: () => BotTask[]](#getwholequeue---bottask)
      - [Get: (index?: number) => BotTask](#get-index-number--bottask)
      - [Remove: (name: string) => void](#remove-name-string--void)
      - [Removef: (predicate: (task: BotTask, index: number, queue: BotTask[]) => boolean) => void](#removef-predicate-task-bottask-index-number-queue-bottask--boolean--void)
      - [Clear: () => void](#clear---void)
      - [Resume: () => void](#resume---void)
      - [Pause: () => void](#pause---void)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation
    npm i mineflayer-task-manager

## Usage
Example usage (in typescript):
```ts
import { createBot } from "mineflayer";
import { taskManager } from "mineflayer-task-manager";

const bot = createBot({
    username: "Steve",
    host: "localhost",
    port: 25565
})

bot.loadPlugin(taskManager)

bot.once("spawn", () => {
    // Bot will say "Hello 2" one second after it spawned because of Hello 1 executing after 1000 ms,
    // since it was inserted to the start after this was added.
    bot.taskManager.Add("Hello 2", (b) => b.chat("Hello 2"), 0)

    // Bot will execute this second
    bot.taskManager.Insert("Hello 1", (b) => b.chat("Hello 1"), 1000)

    // Bot will execute this first
    bot.taskManager.Insert("Hello 0", (b) => b.chat("Hello 0"))

    bot.taskManager.Add("look", async (b) => await b.lookAt(b.entity.position.offset(0, 0, 1)), 0)
})
```

Looks at the nearest entity, then says hello.
```ts
import { createBot } from "mineflayer";
import { taskManager } from "mineflayer-task-manager";

const bot = createBot({
    username: "Steve",
    host: "localhost",
    port: 25565
})

bot.loadPlugin(taskManager)

bot.once("spawn", () => {
    bot.taskManager.Add("look", async (b) => {
        var entity = b.nearestEntity();
        if (entity == null)
            b.chat("No entity");
        else
            await b.lookAt(entity.position.offset(0, entity.height, 0))
    }, 0)

    bot.taskManager.Add("hello", (b) => b.chat("Hello"))
})
```

# Api documentation

#### Add: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void
	Add an action to the task queue.
	*name* The name of the action use it to distinguish it from the rest.
	*action* the promise based function to execute when we get to it.
	*delay* the time in ms to wait before executing the action, set to 0 by default.

#### Insert: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void
	Add an action to the start of the task queue.
	*name* The name of the action use it to distinguish it from the rest.
	*action* the promise based function to execute when we get to it.
	*delay* the time in ms to wait before executing the action, set to 0 by default.

#### GetWholeQueue: () => BotTask[]
	Get the queue.

#### Get: (index?: number) => BotTask
	Get an action from the queue.
	*index* the index of the task, set to 0 by default.

#### Remove: (name: string) => void
	Remove an action from the queue.
	*name* The name of the action use it to distinguish it from the rest.

#### Removef: (predicate: (task: BotTask, index: number, queue: BotTask[]) => boolean) => void
    Remove all the tasks for which the predicate returned false, from the queue.
    *predicate* Basically the filter.

#### Clear: () => void
    Removes every element from the queue.

#### Resume: () => void
	Resumes executing tasks in the queue.

#### Pause: () => void
	Stops executing tasks in the queue.