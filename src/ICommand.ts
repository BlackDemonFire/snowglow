import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export interface ICommand {
    register(): SlashCommandBuilder | Omit<SlashCommandBuilder, "">;
    execute(interaction: CommandInteraction): void | Promise<void>;
}
