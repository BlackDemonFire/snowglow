import { ButtonBuilder, SlashCommandBuilder } from "@discordjs/builders";
import {
    CacheType,
    CommandInteraction,
    MessageActionRow,
    TextChannel,
} from "discord.js";
import { client } from "../bot.js";
import { database } from "../database.js";
import { ReactionRole } from "../entity/ReactionRole.js";
import { ICommand } from "../ICommand";

class Setup implements ICommand {
    register() {
        return new SlashCommandBuilder()
            .setName("setup")
            .setDescription("Sets up the selfrole message")
            .setDescriptionLocalizations({
                de: "Erstellt die Selfrole Nachricht",
            })
            .addStringOption((option) =>
                option
                    .setName("message")
                    .setRequired(true)
                    .setNameLocalizations({ de: "nachricht" })
                    .setDescription("The message to display")
                    .setDescriptionLocalizations({
                        de: "Die Nachricht, die angezeigt werden soll",
                    })
            )
            .setDMPermission(false)
            .setDefaultMemberPermissions(8);
    }
    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply({ ephemeral: true, fetchReply: true });
        const rows: MessageActionRow[] = [];
        let reactionRoles = await database.manager.findBy(ReactionRole, {
            guildId: interaction.guildId,
        });
        const buttons = reactionRoles.map((reactionRole) =>
            new ButtonBuilder()
                .setCustomId(`reactionRole-${reactionRole.roleId}`)
                .setLabel(reactionRole.name)
                .setStyle(1)
                .toJSON()
        );
        const chunkSize = 10;
        for (let i = 0; i < buttons.length; i += chunkSize) {
            const chunk = buttons.slice(i, i + chunkSize);
            rows.push(new MessageActionRow().addComponents(...chunk));
        }
        const channel = (client.channels.resolve(interaction.channelId) ||
            (await client.channels.fetch(
                interaction.channelId
            ))) as TextChannel;
        await channel
            .send({
                components: rows,
                content: interaction.options.getString("message", true),
            })
            .catch(() => {
                interaction.user.send({ content: "Could not send message" });
            });
        await interaction.editReply({ content: "Setup complete!" });
    }
}
export default new Setup();
