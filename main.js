const Discord = require("discord.js");
const fs = require("fs");

require("dotenv").config({ path: "./botSecrets.env" });

const dictionaryOfBread = "./breadDictionary.jsonl";

const maxLength = 50;
const allowedCharacters = [..."abcdefghijklmnopqrstuvwxyz'"];

const client = new Discord.Client({
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: true,
  },
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", async () => {
  console.log("Bot Online!");
  client.user.setStatus("online");

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  await guild.members.me.setNickname("The Bread-Bot");
});

client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL);
  if (!channel) {
    console.log("Fatal Error: Could Not Find Channel");
    return;
  }

  channel.send(
    `🎉 Welcome to the **Breaded Server**, ${member.user}. Our staff team hopes that you have a good time and enjoy yourself. Don't forget to check out <#1392340114386059335>, <#1392341984848384090>, and <#1392336355941552159> to learn more about the server.`
  );
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping")
    await interaction.reply({
      content: `Pong! Bot functional for ${interaction.user}`,
      flags: Discord.MessageFlags.Ephemeral,
    });

  if (interaction.commandName === "add-word") {
    if (interaction.channel?.id !== process.env.DICTIONARY_ID) {
      await interaction.reply({
        content: "That command cannot be used in this channel.",
        flags: Discord.MessageFlags.Ephemeral,
      });
      return;
    }

    let englishWord = interaction.options
      .getString("english-word")
      .toLowerCase();
    let breadWord = interaction.options
      .getString("breadish-word")
      .toLowerCase();

    if (!englishWord || !breadWord) {
      await interaction.reply({
        content: "Please enter all required fields.",
        flags: Discord.MessageFlags.Ephemeral,
      });
      return;
    }

    const lines = fs
      .readFileSync(dictionaryOfBread, "utf-8")
      .split("\n")
      .filter(Boolean);

    const dictionary = lines.map((line) => JSON.parse(line));

    const englishTaken = dictionary.some(
      (entry) => entry.english.toLowerCase() === englishWord
    );
    const breadTaken = dictionary.some(
      (entry) => entry.bread.toLowerCase() === breadWord
    );

    if (englishTaken || breadTaken) {
      await interaction.reply({
        content: "That word has already been mapped!",
        flags: Discord.MessageFlags.Ephemeral,
      });
      return;
    }

    if (breadWord.length > maxLength) {
      await interaction.reply({
        content:
          "That breadish word is too long! Please keep it under 50 characters.",
        flags: Discord.MessageFlags.Ephemeral,
      });
      return;
    }

    const invalidChar = [...breadWord].find(
      (char) => !allowedCharacters.includes(char)
    );
    if (invalidChar) {
      await interaction.reply({
        content:
          "That word has invalid characters! Please modify your Breadish word.",
        flags: Discord.MessageFlags.Ephemeral,
      });
      return;
    }

    const newEntry = {
      english: englishWord,
      bread: breadWord,
      ID: interaction.user.id,
    };

    fs.appendFileSync(dictionaryOfBread, JSON.stringify(newEntry) + "\n");

    await interaction.reply({
      content: `🎉 Congratulations ${interaction.user}! You have successfully created a breadish word!`,
      flags: Discord.MessageFlags.Ephemeral,
    });
  }

  if (interaction.commandName === "remove-word") {
    if (interaction.channel?.id !== process.env.DICTIONARY_ID) {
      await interaction.reply({
        content: "That command cannot be used in this channel.",
        flags: Discord.MessageFlags.Ephemeral,
      });
      return;
    }

    const breadWord = interaction.options
      .getString("breadish-word")
      .toLowerCase();

    const lines = fs
      .readFileSync(dictionaryOfBread, "utf-8")
      .split("\n")
      .filter(Boolean);

    const dictionary = lines.map((line) => JSON.parse(line));

    const entry = dictionary.find((entry) => entry.bread === breadWord);

    if (!entry) {
      await interaction.reply({
        content: "That Breadish word was not found!",
        flags: Discord.MessageFlags.Ephemeral,
      });
      return;
    }

    if (
      (entry.ID !== interaction.user.id) &
      (interaction.user.id !== process.env.OWNER_ID)
    ) {
      await interaction.reply({
        content: "You can only delete your own Breadish words!",
        flags: Discord.MessageFlags.Ephemeral,
      });
    }

    const updatedDictionary = dictionary.filter((e) => e.bread !== breadWord);
    const updatedLines = (y =
      updatedDictionary.map((e) => JSON.stringify(e)).join("\n") + "\n");
    fs.writeFileSync(dictionaryOfBread, updatedLines);

    await interaction.reply({
      content: `🎉 Congratulations ${interaction.user}! You have successfully deleted your Breadish word!`,
      flags: Discord.MessageFlags.Ephemeral,
    });
    return;
  }

  if (interaction.commandName === "search") {
    if (interaction.channel?.id !== process.env.DICTIONARY_ID) {
      await interaction.reply({
        content: "That command cannot be used in this channel.",
        flags: Discord.MessageFlags.Ephemeral,
      });
      return;
    }

    const word = interaction.options.getString("english-word").toLowerCase();

    const lines = fs
      .readFileSync(dictionaryOfBread, "utf-8")
      .split("\n")
      .filter(Boolean);

    const dictionary = lines.map((line) => JSON.parse(line));

    const entry = dictionary.find((entry) => entry.english === word);

    if (!entry) {
      await interaction.reply({
        content: "I could not find that word! Add the word with /add-word.",
        flags: Discord.MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.reply({
      content: `The Breadish translation for '${word}' is **${entry.bread}**.`,
      flags: Discord.MessageFlags.Ephemeral,
    });
  }

  if (interaction.commandName === "translate") {
    if (interaction.channel?.id !== process.env.DICTIONARY_ID) {
      await interaction.reply({
        content: "That command cannot be used in this channel.",
        flags: Discord.MessageFlags.Ephemeral,
      });
      return;
    }

    const lines = fs
      .readFileSync(dictionaryOfBread, "utf-8")
      .split("\n")
      .filter(Boolean);

    const dictionary = lines.map((line) => JSON.parse(line));

    let translationMode = interaction.options.getString("mode");

    let text = interaction.options.getString("text").toLowerCase();

    let modifiedText = [...text]
      .map((char) => (allowedCharacters.includes(char) ? char : " "))
      .join("")
      .replace(/\s+/g, " ")
      .trim();

    let words = modifiedText.split(" ").filter((word) => word.length > 0);

    let translatedWords = [];
    let unknownWords = [];

    for (let i = 0; i < words.length; i++) {
      let currentWord = words[i];
      let entry;

      if (translationMode === "ETB") {
        entry = dictionary.find((entry) => entry.english === currentWord);
        translatedWords.push(entry ? entry.bread : `currentWord`);
      } else if (translationMode === "BTE") {
        entry = dictionary.find((entry) => entry.bread === currentWord);
        translatedWords.push(entry ? entry.english : `currentWord`);
      } else {
        await interaction.reply(
          "This error is so stupid, it doesn't even need an error. Figure out yourself."
        );
        return;
      }

      if (!entry) unknownWords.push(currentWord);
    }

    if (unknownWords.length > 0) {
      const uniqueUnknownWords = [...new Set(unknownWords)];

      await interaction.reply({
        content: `The word/s **${uniqueUnknownWords.join(
          ", "
        )}** do not exist. Please add the missing words with\`/add-word\`!`,
        flags: Discord.MessageFlags.Ephemeral,
      });
      return;
    }

    const finalTranslation = translatedWords.join(" ");

    await interaction.reply(
      `🎉 Your translated message is: **${finalTranslation}**!`
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
