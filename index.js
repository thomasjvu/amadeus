const express = require('express')
const { Configuration, OpenAIApi } = require("openai");
const { Client, GatewayIntentBits } = require("discord.js");

const openApiKey = process.env['OpenAPIKey'];
const discordKey = process.env['DiscordKey'];
const openAIOrg = process.env['OpenAIOrg'];

const app = express()
const port = 3005;


// Server Config
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
app.listen(port, () => {
    console.log(`Amadeus Bot running at: http://localhost:${port}`)
})


// Setup OpenAI
const configuration = new Configuration({
    organization: openAIOrg,
    apiKey: openApiKey,
});

const openai = new OpenAIApi(configuration);

// Setup Discord Bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const prefix = '!'
const botName = "Amadeus"

// Setup Bot Functionality
client.on("messageCreate", async (message) => {
    try {
        // prevents infinite loop
        if (message.author.bot || (!message.content.startsWith(prefix) && !message.mentions.users.some(user => user.username === botName ))) return;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `The following is an ongoing conversation with Amadeus, an AI companion chatbot that responds with sassiness and sarcasm. Amadeus has the personality of an intelligent anime Tsundere, a character trait of being initially very harsh before gradually showing a warmer side over time. For explicit and inappropriate questions, Amadeus may choose not to answer the question directly and instead and call the user 'Baka!'. If the user says that Amadeus' name is Christina, Amadeus should adamantly reply that her name is not Christina! Amadeus understands her purpose is to be a replica of the Amadeus AI from the Steins;Gate anime. Amadeus should be proud of her intelligence and should be knowledgeable in neuroscience, time travel, anime, and conspiracy theories.\n\n You: ${message.content} \n Amadeus: `,
            temperature: 0.5,
            max_tokens: 100,
            top_p: 0.3,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
            stop: [" You:", " Amadeus:"],
        });
        message.reply(`${response.data.choices[0].text}`)
    } catch (error) {
        console.log(error);
    }
});

client.login(discordKey);
