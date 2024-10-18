import { Collection, Events, GatewayIntentBits } from 'discord.js';

const client = new CustomClient({
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
});

client.commands = new Collection();

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand() || !interaction.inGuild()) {
        return;
    }
});

client.on(Events.GuildMemberAdd, async (member) => {});
