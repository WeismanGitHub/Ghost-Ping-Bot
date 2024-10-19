import { SuccessEmbed } from '../embeds';
import Guild from '../db/Guild';
import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    ChannelType,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('set-channel')
        .setContexts(InteractionContextType.Guild)
        .setDescription('Set the channel from which to ghost ping new members.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setRequired(true)
                .setDescription('ghost ping channel')
                .addChannelTypes([ChannelType.GuildText])
        ),

    execute: async function (interaction: ChatInputCommandInteraction) {
        if (!interaction.inGuild()) {
            throw new Error('Not in guild.');
        }

        const channel = interaction.options.getChannel('channel');

        if (!channel) {
            throw new Error('Channel is null.');
        }

        await Guild.upsert({
            id: interaction.guildId,
            channelId: channel.id,
        });

        await interaction.reply({
            ephemeral: true,
            embeds: [new SuccessEmbed('Success!', 'Set the ghost ping channel.')],
        });
    },
};
