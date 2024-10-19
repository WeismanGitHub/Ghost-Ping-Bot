import {
    Client,
    ClientOptions,
    Collection,
    Events,
    GatewayIntentBits,
    userMention,
} from 'discord.js';
import CustomError from './custom-error';
import sequelize from './db/sequelize';
import { ErrorEmbed } from './embeds';
import { readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import Guild from './db/Guild';

class CustomClient extends Client {
    commands: Collection<unknown, unknown>;

    constructor(options: ClientOptions) {
        super(options);

        this.commands = new Collection();
    }
}

const client = new CustomClient({
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
});

const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath);

for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = require(filePath).default;

    if (!command.data || !command.execute) {
        throw new Error(
            `The command at ${filePath} is missing a required "data" or "execute" property.`
        );
    }

    client.commands.set(command.data.name, command);
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand() || !interaction.inGuild()) {
        return;
    }

    const command = client.commands.get(interaction.commandName);

    try {
        // @ts-ignore
        await command.execute(interaction);
    } catch (err) {
        if (!(err instanceof CustomError)) {
            console.error(err);
        }

        const embed = new ErrorEmbed(err instanceof CustomError ? err.message : null);

        if (interaction.replied || interaction.deferred) {
            interaction.followUp({ embeds: [embed], ephemeral: true });
        } else {
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
});

client.on(Events.GuildMemberAdd, async (member) => {
    try {
        const guild = await Guild.findOne({ where: { id: member.guild.id } });

        if (!guild) {
            return;
        }

        const channel = await client.channels.fetch(guild.channelId);

        if (!channel) {
            return;
        }

        if (channel.isSendable()) {
            const message = await channel.send({ content: userMention(member.id) });
            await message.delete();
        }
    } catch (err) {
        console.error(err);
    }
});

dotenv.configDotenv();
const token = process.env.TOKEN;

if (!token) {
    throw new Error('TOKEN is undefined.');
}

sequelize.authenticate().then(() => {
    client.login(token).then(() => console.log('> logged in'));
});
