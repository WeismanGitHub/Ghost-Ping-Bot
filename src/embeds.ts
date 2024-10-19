import { EmbedBuilder } from 'discord.js';

class CustomEmbed extends EmbedBuilder {
    constructor() {
        super();
    }
}

class ErrorEmbed extends CustomEmbed {
    constructor(description: string | null = null, statusCode: number | null = null) {
        super();

        this.setTitle("There's been an error!")
            .setDescription(description)
            .setColor('#FF0000') // Red
            .setFooter({ text: `Status Code: ${statusCode ?? 'Unknown'}` });
    }
}

class SuccessEmbed extends CustomEmbed {
    constructor(title: string | null, description: null | string = null) {
        super();

        this.setTitle(title).setDescription(description).setColor('#00FF00'); // Green
    }
}

export { ErrorEmbed, SuccessEmbed };
