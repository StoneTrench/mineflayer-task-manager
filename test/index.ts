import { createBot } from "mineflayer";
import { taskManager } from "../index";

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