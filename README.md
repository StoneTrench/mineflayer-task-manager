# mineflayer-task-manager

A very simple mineflayer task manager. It's promise based.

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