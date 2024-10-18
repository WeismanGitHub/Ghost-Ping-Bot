import { Collection, EmbedBuilder, Events, GatewayIntentBits } from 'discord.js';
import CustomError from './custom-error';
import { readdirSync } from 'fs';
import { join } from 'path';

const foldersPath = join(__dirname, 'commands');
const commandFolders = readdirSync(foldersPath);

const client = new CustomClient({
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
});

client.commands = new Collection();

for (const folder of commandFolders) {
    const commandsPath = join(foldersPath, folder);
    const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const command = require(filePath);

        if (!command.data || !command.execute) {
            throw new Error(
                `The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }

        client.commands.set(command.data.name, command);
    }
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand() || !interaction.inGuild()) {
        return;
    }

    const command = client.commands.get(interaction.commandName);

    try {
        await command.execute(interaction);
    } catch (err) {
        const embed = new EmbedBuilder();

        if (interaction.replied || interaction.deferred) {
            interaction.followUp({ embeds: [embed], ephemeral: true });
        } else {
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
});

client.on(Events.GuildMemberAdd, async (member) => {});
