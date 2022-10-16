<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Api documentation](#api-documentation)
  - [Bot functions](#bot-functions)
    - [Resume: () => void](#resume---void)
      - [Resume: () => void](#resume---void-1)
    - [Pause: () => void](#pause---void)
      - [Pause: () => void](#pause---void-1)
    - [GetWholeQueue: () => BotTask[]](#getwholequeue---bottask)
      - [GetWholeQueue: () => BotTask[]](#getwholequeue---bottask-1)
    - [Get: (index?: number) => BotTask](#get-index-number--bottask)
      - [Get: (index?: number) => BotTask](#get-index-number--bottask-1)
    - [Remove: (name: string) => void](#remove-name-string--void)
      - [Remove: (name: string) => void](#remove-name-string--void-1)
    - [Insert: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void](#insert-name-string-action-bot-bot--promiseany--void-delay-number--void)
      - [Insert: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void](#insert-name-string-action-bot-bot--promiseany--void-delay-number--void-1)
    - [Add: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void](#add-name-string-action-bot-bot--promiseany--void-delay-number--void)
      - [Add: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void](#add-name-string-action-bot-bot--promiseany--void-delay-number--void-1)
  - [Bot variables](#bot-variables)
    - [TaskManager: {](#taskmanager-)
      - [taskManager: {](#taskmanager-)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Api documentation

## Bot functions

### Resume: () => void

#### Resume: () => void
	Resumes executing tasks in the queue.

### Pause: () => void

#### Pause: () => void
	Stops executing tasks in the queue.

### GetWholeQueue: () => BotTask[]

#### GetWholeQueue: () => BotTask[]
	Get the queue.

### Get: (index?: number) => BotTask

#### Get: (index?: number) => BotTask
	Get an action from the queue.
	`index` the index of the task, set to 0 by default.

### Remove: (name: string) => void

#### Remove: (name: string) => void
	Remove an action from the queue.
	`name` The name of the action use it to distinguish it from the rest.

### Insert: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void

#### Insert: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void
	Add an action to the start of the task queue.
	`name` The name of the action use it to distinguish it from the rest.
	`action` the promise based function to execute when we get to it.
	`delay` the time in ms to wait before executing the action, set to 0 by default.

### Add: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void

#### Add: (name: string, action: (bot: Bot) => (Promise<any> | void), delay?: number) => void
	Add an action to the task queue.
	`name` The name of the action use it to distinguish it from the rest.
	`action` the promise based function to execute when we get to it.
	`delay` the time in ms to wait before executing the action, set to 0 by default.

## Bot variables

### TaskManager: {

#### taskManager: {