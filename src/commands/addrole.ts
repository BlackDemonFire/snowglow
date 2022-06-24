import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import { database } from "../database.js";
import { ReactionRole } from "../entity/ReactionRole.js";
import { ICommand } from "../ICommand";

class AddRole implements ICommand {
    register() {
        return new SlashCommandBuilder()
            .setName("addrole")
            .setDescription("Adds a role to the self assignable roles")
            .setDescriptionLocalizations({
                de: "Fügt eine Rolle zu den selbst zuweisbaren Rollen hinzu",
            })
            .addRoleOption((option) =>
                option
                    .setDescription(
                        "The role the user will be able to self-assign"
                    )
                    .setDescriptionLocalizations({
                        de: "Die Rolle, die der Nutzer sich zuweisen können soll",
                    })
                    .setName("role")
                    .setRequired(true)
                    .setNameLocalizations({ de: "rolle" })
            )
            .addStringOption((option) =>
                option
                    .setName("name")
                    .setDescription("The button text")
                    .setDescriptionLocalizations({
                        de: "Der Text auf dem Knopf",
                    })
                    .setRequired(true)
            )
            .setDMPermission(false)
            .setDefaultMemberPermissions(8);
    }
    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        const existingRoleCount = await database.manager.countBy(ReactionRole, {
            guildId: interaction.guildId,
        });
        if (existingRoleCount === 25) {
            await interaction.reply({
                content:
                    interaction.locale == "de"
                        ? "Es sind bereits 25 Rollen vorhanden"
                        : "There are already 25 roles",
            });
            return;
        }
        const name = interaction.options.getString("name", true);
        const role = interaction.options.getRole("role", true);
        const guildId = interaction.guildId;
        const roleId = role.id;
        const databaseEntry = new ReactionRole();
        databaseEntry.guildId = guildId;
        databaseEntry.name = name;
        databaseEntry.roleId = roleId;
        await database.manager.save(databaseEntry);
        interaction.reply({
            content:
                interaction.locale == "de"
                    ? `${role.name} wurde den selbst zuweisbaren Rollen hinzugefügt.`
                    : `Added ${role.name} to the list of self assignable roles.`,
        });
    }
}
export default new AddRole();
