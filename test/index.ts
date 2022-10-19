import { createBot } from "mineflayer";
import { taskManager } from "../index";

const bot = createBot({
    username: "Steve",
    host: "localhost",
    port: 25565
})

bot.loadPlugin(taskManager)

bot.on("error", console.log)
bot.on("kicked", console.log)

bot.on("chat", (name: string, msg: string) => console.log(name + ": " + msg));

bot.on("spawn", () => {
    bot.taskManager.Add("hello", (b) => b.chat("Hello"), 50)
    bot.taskManager.Add("look", async (b) => {
        var entity = b.nearestEntity();
        if (entity == null)
            b.chat("No entity");
        else
            await b.lookAt(entity.position)
    }, 0)
    bot.taskManager.Add("look", async (b) => {
        var entity = b.nearestEntity();
        if (entity == null)
            b.chat("No entity");
        else {
            await b.lookAt(entity.position)
            b.setControlState("forward", true)

            bot.taskManager.Add("stop", async (b) => {
                b.setControlState("forward", false)
            }, 1000)
        }
    }, 0)
})