import { createBot } from "mineflayer";
import { taskManager } from "../index";

const bot = createBot({
    username: "Steve",
    host: "localhost",
    port: 25565
})

bot.loadPlugin(taskManager)

bot.once("spawn", () => {
    for (let i = 0; i < 10; i++) {
        bot.taskManager.Add("Jump", () => bot.setControlState("jump", true), 1);
        bot.taskManager.Add("unJump", () => bot.setControlState("jump", false), 1);
    }

    console.log(bot.taskManager.GetWholeQueue().map(e => e.name).join(", "))

    bot.taskManager.InsertAt(4, "A", () => bot.chat("hello"));

    console.log(bot.taskManager.GetWholeQueue().map(e => e.name).join(", "))
})