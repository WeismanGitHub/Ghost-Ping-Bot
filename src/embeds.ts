import { EmbedBuilder } from 'discord.js';

class CustomEmbed extends EmbedBuilder {
    constructor() {
        super();
    }
}

class ErrorEmbed extends CustomEmbed {
    constructor(description: string | null = null) {
        super();

        this.setTitle('An error occurred')
            .setDescription(description)
            .setColor('#FF0000'); // Red
    }
}

class SuccessEmbed extends CustomEmbed {
    constructor(title: string | null, description: null | string = null) {
        super();

        this.setTitle(title).setDescription(description).setColor('#00FF00'); // Green
    }
}

export { ErrorEmbed, SuccessEmbed };
