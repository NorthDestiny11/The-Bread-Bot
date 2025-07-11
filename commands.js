const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config({ path: "./botSecrets.env" });

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("add-word")
    .setDescription("Add a new Breadish word!")
    .addStringOption((option) =>
      option
        .setName("english-word")
        .setDescription("Map the corresponding English word to your word!")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("breadish-word")
        .setDescription("Your new Breadish word!")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("remove-word")
    .setDescription("remove your own Breadish word!")
    .addStringOption((option) =>
      option
        .setName("breadish-word")
        .setDescription("The name of your Breadish word!")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("search")
    .setDescription(
      "Search for an English word to find its Breadish translation!"
    )
    .addStringOption((option) =>
      option
        .setName("english-word")
        .setDescription("Search for an English word!")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate between the Breadish and English languages!")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Select which way you are translating the languages!")
        .setRequired(true)
        .addChoices(
          { name: "english-to-breadish", value: "ETB" },
          { name: "breadish-to-english", value: "BTE" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text that you wish to translate!")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("get-roasted")
    .setDescription(
      "I reckon you should figure out what this does by yourself."
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Modifying slah commands!");
    await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), {
      body: commands,
    });
    console.log("Commands changed!");
  } catch (err) {
    console.error("Fatal error! Could not modify commands!");
  }
})();
