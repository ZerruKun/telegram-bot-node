const TelegramApi = require('node-telegram-bot-api');
require("dotenv").config();

//t.me/ZerruTestBot
const token = process.env.token;

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: "1", callback_data: "1"}, {text: "2", callback_data: "2"}, {text: "3", callback_data: "3"}],
            [{text: "4", callback_data: "4"}, {text: "5", callback_data: "5"}, {text: "6", callback_data: "6"}],
            [{text: "7", callback_data: "7"}, {text: "8", callback_data: "8"}, {text: "9", callback_data: "9"}],
            [{text: "0", callback_data: "0"}]
        ]
    })
}

const start = () => {
    bot.setMyCommands([
        {command: "/start", description: "Welcome message"},
        {command: "/info", description: "Show user name"},
        {command: "/game", description: "Start a game"},
    ])
    
    bot.on("message", async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if(text === "/start") {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp")
            return bot.sendMessage(chatId, `Welcome to the ZerruTestBot!`);
        }
    
        if(text === "/info") {
            return bot.sendMessage(chatId, `Your name ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if(text === "/game") {
            await bot.sendMessage(chatId, "Now I will think of a number from 0 to 9.");
            const randomNumber = Math.floor(Math.random() * 10);
            chats[chatId] = randomNumber;
            return bot.sendMessage(chatId, "Try to guess!", gameOptions);
        }

        return bot.sendMessage(chatId, "Don't understand you. Try another command.");
    })

    bot.on("callback_query", msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        bot.sendMessage(chatId, `You select number ${data}`);
    })
}

start();