import { Client } from 'discord.js';

declare global {
    class CustomClient extends Client {
        commands: Collection<unknown, unknown>;
    }
}
