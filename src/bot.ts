import { Client, DiscordAPIError, GuildMemberRoleManager } from "discord.js";
import addrole from "./commands/addrole.js";
import removerole from "./commands/removerole.js";
import setup from "./commands/setup.js";
import config from "./config.js";
import { ICommand } from "./ICommand.js";
import { logger } from "./logger.js";

export const client = new Client({
    intents: [],
});
const commands = new Map<string, ICommand>();
commands.set("addrole", addrole);
commands.set("removerole", removerole);
commands.set("setup", setup);
client.login(config.token);
logger.info("Logging in...");
client.on("ready", async () => {
    logger.info(`Logged in as ${client.user?.username}`);
    const existingCommands = await client.application.commands.fetch();
    for (const [name, command] of commands) {
        if (!existingCommands.has(name)) {
            await client.application.commands.create(
                command.register().toJSON()
            );
        }
    }
});
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const command = commands.get(interaction.commandName);
        if (command) {
            await command.execute(interaction);
        }
    } else if (interaction.isButton()) {
        const args = interaction.customId.split("-");
        if (args[0] !== "reactionRole") return;
        const reactionRoleId = args[1];
        await (interaction.member.roles as GuildMemberRoleManager)
            .add(reactionRoleId)
            .catch(async (exception: DiscordAPIError) => {
                logger.error(exception);
                await interaction.reply({
                    content: "An error occurred while adding the role.",
                    ephemeral: true,
                });
            });
        await interaction.deferReply();
    }
});
