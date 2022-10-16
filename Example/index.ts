import { createBot } from "mineflayer";
import TaskManager from "../index";

const bot = createBot({
    username: "Steve",
    host: "localhost",
    port: 25565
})

bot.loadPlugin(TaskManager)

bot.on("error", console.log)
bot.on("kicked", console.log)

bot.on("spawn", () => {
    bot.taskManager.Add("hello", (b) => b.chat("Hello"), 50)
    bot.taskManager.Add("look", async (b) => await b.lookAt(b.entity.position.offset(0, 0, 1)), 0)
})