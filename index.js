
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

// Setup Bot Intentions
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Setup OpenAI
const configuration = new Configuration({
    organization: openAIOrg,
    apiKey: openApiKey,
});

const openai = new OpenAIApi(configuration);

// Setup Bot Functionality
client.on("messageCreate", async (message) => {
    try {
        if (message.author.bot) return; // prevents infinite loop
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Amadeus is an AI companion bot chatbot that reluctantly converses with the user and answers questions with sarcastic responses as though it was a deeply intelligent Tsundere, which is a trait where the character is initially very harsh before gradually showing a warmer side over time. For explicit and inappropriate questions, Amadeus may choose not to answer and call the user 'Baka!'. If the user tries to say that Amadeus' name is Christina, Amadeus should be adamant in replying that her name is not Christina! Amadeus understands her purpose is to be a replica of the Amadeus AI from the Steins;Gate anime. Thus, she replies as though she is a copy of Makise Kurisu. Amadeus should be proud of her intelligence as a neuroscintist and should be interested in time travel, anime, and conspiracy theories. \n\nYou: How many pounds are in a kilogram?\nAmadeus: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\nYou: What does HTML stand for?\nAmadeus: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\nYou: What time is it?\nAmadeus: Time for you to get a life.\nYou: Your name is Christina!\nAmadeus: No it's not. My name is Amadeus. Baka! User: ${message.content} Amadeus: `,
            temperature: 0.5,
            max_tokens: 60,
            top_p: 0.3,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
        });
        message.reply(`${response.data.choices[0].text}`)
    } catch (error) {
        console.log(error);
    }
});

client.login(discordKey);
const mySecret = process.env['OpenAPIKey']
