import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
} from 'discord.js';
import Guild from '../db/Guild';
import { SuccessEmbed } from '../embeds';
import CustomError from '../custom-error';

export default {
    data: new SlashCommandBuilder()
        .setName('remove-channel')
        .setContexts(InteractionContextType.Guild)
        .setDescription(
            'Remove the ghost ping channel from the database and stop pinging new members.'
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inGuild()) {
            throw new Error('Not in guild.');
        }

        const res = await Guild.destroy({
            where: {
                id: interaction.guildId,
            },
        });

        if (!res) {
            throw new CustomError('No data was deleted.');
        }

        await interaction.reply({
            ephemeral: true,
            embeds: [
                new SuccessEmbed('Success!', 'Users will no longer be ghost pinged.'),
            ],
        });
    },
};
