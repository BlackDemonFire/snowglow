import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import { database } from "../database.js";
import { ReactionRole } from "../entity/ReactionRole.js";
import { ICommand } from "../ICommand";

class RemoveRole implements ICommand {
    register() {
        return new SlashCommandBuilder()
            .setName("removerole")
            .setDescription("Removes a role from the self assignable roles")
            .setDescriptionLocalizations({
                de: "Entfernt eine Rolle von den selbst zuweisbaren Rollen",
            })
            .addRoleOption((option) =>
                option
                    .setDescription(
                        "The role the user will not be able to self-assign anymore"
                    )
                    .setDescriptionLocalizations({
                        de: "Die Rolle, die der Nutzer sich nicht mehr zuweisen können soll",
                    })
                    .setName("role")
                    .setRequired(true)
                    .setNameLocalizations({ de: "rolle" })
            )
            .setDMPermission(false)
            .setDefaultMemberPermissions(8);
    }
    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        const role = interaction.options.getRole("role", true);
        const guildId = interaction.guildId;
        const roleId = role.id;
        const databaseEntry = await database.manager
            .findOneByOrFail(ReactionRole, {
                guildId,
                roleId,
            })
            .catch((error) => {
                interaction.reply({
                    content: error.message,
                });
                return;
            });
        if (!databaseEntry) {
            await interaction.reply({
                content:
                    interaction.locale == "de"
                        ? "Diese Rolle ist nicht zuweisbar."
                        : "This role is not self-assingable.",
            });
            return;
        }
        await database.manager.delete(ReactionRole, {
            guildId,
            roleId,
        });
        interaction.reply({
            content:
                interaction.locale == "de"
                    ? "Die Rolle wurde entfernt"
                    : "The role was removed",
        });
    }
}

export default new RemoveRole();
