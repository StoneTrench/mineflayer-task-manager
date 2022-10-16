# mineflayer-task-manager

A very simple mineflayer task manager. It's promise based, but you can use simple functions in the queue.

Example usage:
```ts
import { createBot } from "mineflayer";
import TaskManager from "mineflayer-task-manager";

const bot = createBot({
    username: "Steve",
    host: "localhost",
    port: 25565
})

bot.loadPlugin(TaskManager)

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

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Api documentation](#api-documentation)
  - [Bot functions](#bot-functions)
      - [Resume: () => void](#resume---void)
      - [Pause: () => void](#pause---void)
      - [GetWholeQueue: () => BotTask[]](#getwholequeue---bottask)
      - [Get: (index?: number) => BotTask](#get-index-number--bottask)
      - [Remove: (name: string) => void](#remove-name-string--void)
      - [Insert: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void](#insert-name-string-action-bot-bot--promiseany--void-delay-number--void)
      - [Add: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void](#add-name-string-action-bot-bot--promiseany--void-delay-number--void)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Api documentation

## Bot functions

#### Resume: () => void
	Resumes executing tasks in the queue.

#### Pause: () => void
	Stops executing tasks in the queue.

#### GetWholeQueue: () => BotTask[]
	Get the queue.

#### Get: (index?: number) => BotTask
	Get an action from the queue.
	`index` the index of the task, set to 0 by default.

#### Remove: (name: string) => void
	Remove an action from the queue.
	`name` The name of the action use it to distinguish it from the rest.

#### Insert: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void
	Add an action to the start of the task queue.
	`name` The name of the action use it to distinguish it from the rest.
	`action` the promise based function to execute when we get to it.
	`delay` the time in ms to wait before executing the action, set to 0 by default.

#### Add: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void
	Add an action to the task queue.
	`name` The name of the action use it to distinguish it from the rest.
	`action` the promise based function to execute when we get to it.
	`delay` the time in ms to wait before executing the action, set to 0 by default.