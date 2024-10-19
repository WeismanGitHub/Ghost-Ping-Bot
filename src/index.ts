import sequelize from './db/sequelize';
import { readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import {
    Client,
    ClientOptions,
    Collection,
    EmbedBuilder,
    Events,
    GatewayIntentBits,
} from 'discord.js';

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

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand() || !interaction.inGuild()) {
        return;
    }

    const command = client.commands.get(interaction.commandName);

    try {
        // @ts-ignore
        await command.execute(interaction);
    } catch (err) {
        console.error(err);

        const embed = new EmbedBuilder();

        embed.setDescription('error');

        if (interaction.replied || interaction.deferred) {
            interaction.followUp({ embeds: [embed], ephemeral: true });
        } else {
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
});

client.on(Events.GuildMemberAdd, async (member) => {
    console.log(member);
});

dotenv.configDotenv();
const token = process.env.TOKEN;

if (!token) {
    throw new Error('TOKEN is undefined.');
}

sequelize.authenticate().then(() => {
    client.login(token).then(() => console.log('> logged in'));
});
