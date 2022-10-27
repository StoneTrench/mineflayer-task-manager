const createBot = require("mineflayer").createBot;
const taskManager = require("../index").taskManager;

const bot = createBot({
    username: "Steve",
    host: "localhost",
    port: 25565
})

bot.loadPlugin(taskManager)

bot.on("chat", (u, m) => console.log(`Chat: <${u}> ${m}`))

bot.once("spawn", () => {
    // Pause test
        console.log("Pausing...")
    bot.taskManager.Pause();

    bot.taskManager.Add("1", () => {
        var actions = [() => console.log("Test 1")];

        actions.push(() => bot.chat("Hello"));

        actions.push(() => console.log("Test 1 Done"))
        bot.taskManager.InsertQueue("T1", actions, false, []);

        console.log("Test 1 Queue: " + bot.taskManager.GetWholeQueue().map(e => e.name).join(", "));
        console.log();
    })
    bot.taskManager.Add("2", () => {
        var actions = [() => console.log("Test 2")];
        var delays = [500];

        for (let i = 0; i < 10; i++) {
            actions.push(() => bot.entity.yaw += Math.PI / 4);
            delays.push(500);
        }

        actions.push(() => console.log("Test 2 Done"))
        delays.push(500);
        bot.taskManager.InsertQueue("T2", actions, false, delays);

        console.log("Test 2 Queue: " + bot.taskManager.GetWholeQueue().map(e => e.name).join(", "));
        console.log();
    })
    bot.taskManager.Add("3", () => {
        const GetTestName1 = "Get_Test_1"
        const GetTestName2 = "Get_Test_2"

        // Add test
        bot.taskManager.Add("2", () => console.log("Test 3, 2"))
        bot.taskManager.Add("3", () => console.log("Test 3, 3"))
        bot.taskManager.Add("4", () => console.log("Test 3, 4"))

        // Insert test
        bot.taskManager.Insert("1", () => console.log("Test 3, 1"))
        bot.taskManager.Insert(GetTestName1, () => console.log("Test 3, 0"))

        // Get test 1
        console.log("Get test " + bot.taskManager.Get().name == GetTestName1)

        // Insert test
        bot.taskManager.InsertAt(3, GetTestName2, () => console.log("Insert"))

        // Get test 2
        console.log("Get test " + bot.taskManager.Get(3).name == GetTestName2)

        // GetWholeQueue test
        console.log("Test 3 Queue: " + bot.taskManager.GetWholeQueue().map(e => e.name).join(", "));
        console.log("Test 3 setup done")
        console.log();
    })

    setTimeout(() => {
        console.log("Unpausing...")
        bot.taskManager.Resume();
        console.log("Begin testing")
    })

    bot.on("physicsTick", () => {
        if (!bot.taskManager.Get()) {
            console.log("Tests completed")
            process.exit();
        }
    })
})