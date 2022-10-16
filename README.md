# mineflayer-task-manager

A very simple mineflayer task manager. It's promise based.

Example usage:
```ts
import { createBot } from "mineflayer";
import botTaskManager from "mineflayer-task-manager";

const bot = createBot({
    username: "Stephen",
    host: "localhost",
    port: 25565
})

bot.loadPlugin(botTaskManager)

bot.once("spawn", () => {
    // Bot will say "Hello 2" one second after it spawned because of Hello 1 executing after 1000 ms,
    // since it was inserted to the start after this was added.
    bot.taskManager_Add("Hello 2", (b) => b.chat("Hello 2"), 0)

    // Bot will execute this second
    bot.taskManager_Insert("Hello 1", (b) => b.chat("Hello 1"), 1000)

    // Bot will execute this first
    bot.taskManager_Insert("Hello 0", (b) => b.chat("Hello 0"))

    bot.taskManager.Add("look", async (b) => await b.lookAt(b.entity.position.offset(0, 0, 1)), 0)
})
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Api documentation](#api-documentation)
    - [TaskManager](#taskmanager)
      - [taskManager_GetWholeQueue: () => BotTask[]](#taskmanager_getwholequeue---bottask)
      - [taskManager_Get: (index?: number) => BotTask](#taskmanager_get-index-number--bottask)
      - [taskManager_Remove: (name: string) => void](#taskmanager_remove-name-string--void)
      - [taskManager_Insert: (name: string, action: (bot: Bot) => Promise<any>, delay?: number) => void](#taskmanager_insert-name-string-action-bot-bot--promiseany-delay-number--void)
      - [taskManager_Add: (name: string, action: (bot: Bot) => Promise<any>, delay?: number) => void](#taskmanager_add-name-string-action-bot-bot--promiseany-delay-number--void)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Api documentation
### TaskManager

#### taskManager_GetWholeQueue: () => BotTask[]
	Get the queue.

#### taskManager_Get: (index?: number) => BotTask
	Get an action from the queue.
	`index` the index of the task, set to 0 by default.

#### taskManager_Remove: (name: string) => void
	Remove an action from the queue.
	`name` The name of the action use it to distinguish it from the rest.

#### taskManager_Insert: (name: string, action: (bot: Bot) => Promise<any>, delay?: number) => void
	Add an action to the start of the task queue.
	`name` The name of the action use it to distinguish it from the rest.
	`action` The promise based function to execute when we get to it.
	`delay` The time in ms to wait before executing the action, set to 0 by default.

#### taskManager_Add: (name: string, action: (bot: Bot) => Promise<any>, delay?: number) => void
	Add an action to the task queue.
	`name` The name of the action use it to distinguish it from the rest.
	`action` The promise based function to execute when we get to it.
	`delay` The time in ms to wait before executing the action, set to 0 by default.