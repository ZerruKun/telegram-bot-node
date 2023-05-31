const TelegramApi = require('node-telegram-bot-api');
require("dotenv").config();
const {gameOptions, againOptions} = require("./options")

//t.me/ZerruTestBot
const token = process.env.token;

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Now I will think of a number from 0 to 9.");
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Try to guess!", gameOptions);
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
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, "Don't understand you. Try another command.");
    })

    bot.on("callback_query", msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === "/again") {
            return startGame(chatId);
        }
        if(data === chats[chatId]) {
            return bot.sendMessage(chatId, `You are right! It's a ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `You are wrong! It's a ${chats[chatId]}`, againOptions);
        }
    })
}

start();