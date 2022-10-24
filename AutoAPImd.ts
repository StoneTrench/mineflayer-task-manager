import { readdirSync, readFileSync, writeFileSync } from "fs";
var exec = require('child_process').exec;

// Generates the api.md document

(() => {

    const outputFile = "./api.md";
    const pluginsFolder = "./";

    const ignore = [
        ".git",
        "node_modules",
        "Example",
        ".gitignore",
    ]

    const plugins = readdirSync(pluginsFolder).filter(e => e == "index.d.ts");

    let Description: { func: string, desc: string[], variable: boolean }[] = [];

    for (let i = 0; i < plugins.length; i++) {

        const file: string = readFileSync(pluginsFolder + plugins[i], 'utf-8');
        console.log(pluginsFolder + plugins[i])

        const InterfaceData: string[] = [];

        let bracketCounter = 0;
        let atInterface = false;

        // Extract lines in interface
        const lines: string[] = file.split("\n")
        for (let l = 0; l < lines.length; l++) {
            const line = lines[l];
            if (line.includes("{")) bracketCounter++;
            if (line.includes("}")) bracketCounter--;

            if (atInterface) {
                if (bracketCounter < 2) atInterface = false;
                else InterfaceData.push(line.trim())
            }

            if (bracketCounter == 2 && line.includes("interface")) {
                if (InterfaceData.length != 0)
                    break;
                atInterface = true;
            }
        }

        let inComment = false;

        // Extract funtions and descriptions
        for (let l = InterfaceData.length - 1; l >= 0; l--) {
            const line = InterfaceData[l];

            if ((line.includes("=>") || line.includes(":")) && !inComment) {
                Description.push({
                    func: line.endsWith(";") ? line.slice(0, line.length - 1) : line,
                    desc: [],
                    variable: !line.includes("=>")
                })
            }

            if (line.includes("/**")) {
                inComment = false;
                Description[Description.length - 1].desc = Description[Description.length - 1].desc.reverse()
            }

            if (inComment) {
                let descriptionLine = line.replace("* ", "");
                if (descriptionLine.startsWith("@param")) {
                    const descSplit = descriptionLine.split(" ").splice(1)
                    descSplit[0] = "*" + descSplit[0] + "*"
                    descriptionLine = descSplit.join(" ");
                }
                else if (descriptionLine.startsWith("@returns")) {
                    descriptionLine = descriptionLine.replace("@returns", "*Returns*");
                }
                if (descriptionLine.endsWith(".") || descriptionLine.endsWith(";")) {
                    descriptionLine = descriptionLine.slice(0, descriptionLine.length - 1)
                }
                Description[Description.length - 1].desc.push(descriptionLine);
            }

            if (line.includes("*/")) inComment = true;
        }
    }

    Description = Description.sort((a, b) => (a.variable ? 1 : 0) - (b.variable ? 1 : 0)).reverse()

    const APIFileLines: string[] = []

    APIFileLines.push("# Api documentation")
    APIFileLines.push("")
    APIFileLines.push("## Bot functions")

    let previousGroup = ""

    let inVariables = false;
    for (let d = 0; d < Description.length; d++) {
        const desc = Description[d];

        if (!inVariables && desc.variable) {
            APIFileLines.push("")
            APIFileLines.push("## Bot variables")
            inVariables = true;
        }

        const t = desc.func.split("_")[0]
        if(previousGroup != t){
            let title = t
            title = title[0].toUpperCase() + title.substring(1)
            previousGroup = t
            APIFileLines.push("")
            APIFileLines.push("### " + title)
        }

        // APIFileLines.push("")
        // APIFileLines.push("#### " + desc.func);

        if(desc.desc.length == 0) console.log(desc.func + "\nHas no description!" )

        for (let l = 0; l < desc.desc.length; l++) {
            APIFileLines.push("- " + desc.desc[l] + ".");
        }
    }

    writeFileSync(outputFile, APIFileLines.join("\n"), "utf-8");

    exec("doctoc " + outputFile);
})();