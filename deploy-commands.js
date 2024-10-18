const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
require('dotenv').config();

const commandsPath = join(__dirname, 'dist', 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = require(filePath).default.data.toJSON();

    commands.push(command);
}

const rest = new REST().setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(process.env.ID), {
    body: commands,
}).then((res) => console.log('> deployed commands'));
