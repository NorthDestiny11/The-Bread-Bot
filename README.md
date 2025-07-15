# The-Bread-Bot

### Features

- **Translation (use /translate)**
  Used for translation between English and Breadish.

- **Get roasted (use /get-roasted)**
  Add your own roasts to humiliate yourself and your friends.

- **Search for a word (use /search)**
  Search for any word in the breadish dictionary.

- **Add and remove words (use /add-word and /remove-word respectively)**
  Add or remove any desired words to/from the Breadish dictionary.

- **Ping (use /ping)**
  All this command does is test the functionality of The Bread-Bot.

- **Welcome messages**
  When a member joins the server, the bot will provide a welcome message that tags the user. You will have to manually edit main.js to change the channels the bot references.

### Setup

- **Libraries**

  - It is critical that node.js has been installed and the following libraries have also been installed:
  - **discord.js**. You can get this library using **npm i discord.js**.
  - **dotenv**. You can get this library by using **npm i dotenv**.

- **Files**

After installing the mentioned libraries along node.js, there are several files that will need to be set up.

**Roasts.json**. This file should be setup like the following example:

- `{ roasts: ["Roast 1", "Roast 2"]}`

Feel free to add as many roasts as desired, the program is dynamic, and will allow for infinitely many (with limitations) roasts.

**breadDictionary.jsonl**. This file only has to be created, and can remain empty, as the bot will automatically add data to it.

- **Note**: Messing with newlines and indentation in this file will cause the bot to break. After creation, please leave the file untouched.

**botSecrets.env**. This file will include all the data the bot requires to operate normally. Please add the following lines.

```env
DISCORD_TOKEN=
APPLICATION_ID=
OWNER_ID=
WELCOME_CHANNEL=
GUILD_ID=
DICTIONARY_ID=
```

- `DISCORD_TOKEN`: Make this equal to your Bot's discord token. This can be found from the **Bot** tab from your bot's menu in the Discord Developer Portal, at: [Discord Developer Portal](https://discord.com/developers/applications)
- `APPLICATION_ID`: This can also be found from the Discord Developer Portal, under the **General Information** tab.
- `OWNER_ID`: From Discord, locate the owner from anywhere (DMs, Servers, Group Chats are all acceptable), and right click their name, and go to **Copy User ID**.
- `WELCOME_CHANNEL`: Locate the welcome channel on the server you wish to add this bot to, and similarly to finding the Owner's ID, right click and select **Copy Channel ID**.
- `GUILD_ID`: Right click on the server's badge and select **Copy Server ID**.
- `DICTIONARY_ID`: Locate your dictionary channel, and select **Copy Channel ID**.

Make sure that botSecrets.env, breadDictionary.jsonl, and roasts.json are all in the same folder as main.js and commands.js.

Finally, from main.js: Replace the mentioned channels on line 40 with your desired channels. In my case, I found it a good idea to mention rules, self-roles, and how-to-get-roles. Feel free to change this to whatever you want by first finding the desired channels and then Copying their ID, then replace the channel inside the code block`<#...>` with your desired channel. Feel free to modify the message to whatever you desire.

### Running the bot

To run the bot, firstly, open your terminal from the directory the files are in. Next run: **`node commands.js`**. If successful, you should see a response saying **Commands changed!**. This means that the bot has correctly set up your slash commands, meaning that all users can see and use them from discord. After doing this, run **`node main.js`**. If done correctly, you should see a message saying **Bot Online!**, this means that your bot should be fully operational for all users. Do not worry if you cannot see the slash commands from the server for a while, it is common for larger servers to take a longer time to implement these commands.
