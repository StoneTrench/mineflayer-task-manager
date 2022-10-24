const createBot = require("mineflayer").createBot;
const taskManager = require("../index").taskManager;

const bot = createBot({
    username: "Steve",
    host: "localhost",
    port: 25565
})

bot.loadPlugin(taskManager)

bot.once("spawn", () => {
    for (let i = 0; i < 10; i++) {
        bot.taskManager.Add("Spin", spin, 500);
    }
    console.log(bot.taskManager.GetWholeQueue().map(e => e.name).join(", "));
})

function spin(b) {
    b.entity.yaw += Math.PI / 4;
}