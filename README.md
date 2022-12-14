# mineflayer-task-manager

A mineflayer task queue manager. It's promise based, but you can also use non async functions in the queue.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Usage](#usage)
- [Api documentation](#api-documentation)
  - [Action](#action)
  - [Add: (name: string, action: Action, delay?: number) => void](#add-name-string-action-action-delay-number--void)
  - [Insert: (name: string, action: Action, delay?: number) => void](#insert-name-string-action-action-delay-number--void)
  - [InsertQueue: (name: string | string[], actions: Action[], add?: boolean, delays?: number[]) => void](#insertqueue-name-string--string-actions-action-add-boolean-delays-number--void)
  - [InsertAt: (index: number, name: string, action: Action, delay?: number) => void](#insertat-index-number-name-string-action-action-delay-number--void)
  - [Remove: (name: string) => void](#remove-name-string--void)
  - [Removef: (predicate: (task: BotTask, index: number, queue: BotTask[]) => boolean) => void](#removef-predicate-task-bottask-index-number-queue-bottask--boolean--void)
  - [Get: (index?: number) => BotTask](#get-index-number--bottask)
  - [GetWholeQueue: () => BotTask[]](#getwholequeue---bottask)
  - [Clear: () => void](#clear---void)
  - [Pause: () => void](#pause---void)
  - [Resume: () => void](#resume---void)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation
    npm i mineflayer-task-manager

## Usage
Makes 10 tasks that make the bot spin by 45 degrees every half a second, then writes the task queue to the terminal: (javascript)
```js
const createBot = require("mineflayer").createBot;
const taskManager = require("mineflayer-task-manager").taskManager;

const bot = createBot({
    username: "Steve",
    host: "localhost",
    port: 25565
})

bot.loadPlugin(taskManager)

bot.once("spawn", () => {
    // Creates tasks
    for (let i = 0; i < 10; i++) {
        bot.taskManager.Add("Spin", spin, 500);
    }

    // Writes the tasks to the console
    console.log(bot.taskManager.GetWholeQueue().map(e => e.name).join(", "));
})

// Rotate by 45 degrees or ??/4 radians.
function spin(b) {
    b.entity.yaw += Math.PI / 4;
}
```

Here's the same example but using the InsertQueue function: (javascript)
```js
const createBot = require("mineflayer").createBot;
const taskManager = require("mineflayer-task-manager").taskManager;

const bot = createBot({
    username: "Steve",
    host: "localhost",
    port: 25565
})

bot.loadPlugin(taskManager)

bot.once("spawn", () => {
    var actions = [];
    var delays = [];

    for (let i = 0; i < 10; i++) {
        actions.push(spin);
        delays.push(500);
    }

    bot.taskManager.InsertQueue("Spin", actions, false, delays);

    console.log(bot.taskManager.GetWholeQueue().map(e => e.name + " " + e.delay).join(", "));
})

function spin(b) {
    b.entity.yaw += Math.PI / 4;
}
```

Hello example: (typescript)
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

Looks at the nearest entity, then says hello: (typescript)
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

## Api documentation

### Action
- It's either a function or an async/Promise function.
- *Action = ((bot: Bot) => void | Promise<void>)*

### Add: (name: string, action: Action, delay?: number) => void
- Add an action to the task queue.
- *name* The name of the action use it to distinguish it from the rest.
- *action* the promise/void based function to execute when we get to it.
- *delay* the time in ms to wait before executing the action, set to 0 by default.

### Insert: (name: string, action: Action, delay?: number) => void
- Add an action to the start of the task queue.
- *name* The name of the action use it to distinguish it from the rest.
- *action* the promise/void based function to execute when we get to it.
- *delay* the time in ms to wait before executing the action, set to 0 by default.

### InsertQueue: (name: string | string[], actions: Action[], add?: boolean, delays?: number[]) => void
- You can define an array of actions, and insert them to the start of the queue while they keep their order the same way they are in the actions array.
- *name* Either a name that it will assign to each action, or an array of names with the same length as the actions array that it will pair up with the actions.
- *actions* The list of Actions to either insert at the start of the queue, or add at the end of the queue.
- *add* Incase you want to add the actions to the end of queue instead of inserting them. Set to false by default.
- *delays* An array containing all the delays for each of the tasks, which will get paired up like the names. Set to an empty array my default.

### InsertAt: (index: number, name: string, action: Action, delay?: number) => void
- Add an action at the index of the task queue. Moves the element already at the index by +1 and so on.
- *index* The index where the action should go.
- *name* The name of the action use it to distinguish it from the rest.
- *action* the promise/void based function to execute when we get to it.
- *delay* the time in ms to wait before executing the action, set to 0 by default.

### Remove: (name: string) => void
- Remove an action from the queue.
- *name* The name of the action use it to distinguish it from the rest.

### Removef: (predicate: (task: BotTask, index: number, queue: BotTask[]) => boolean) => void
- Remove all the tasks for which the predicate returned false, from the queue.
- *predicate* Basically the filter.

### Get: (index?: number) => BotTask
- Get a task from the queue.
- *index* the index of the task, set to 0 by default.
- *Returns* The bot task at the index.

### GetWholeQueue: () => BotTask[]
- Get the queue.
- *Returns* The whole queue.

### Clear: () => void
- Removes every element from the queue.

### Pause: () => void
- Stops executing tasks in the queue.

### Resume: () => void
- Resumes executing tasks in the queue.