import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const API_KEY_BOT = "7372683862:AAHWXhW4LOA_T1zWJBgUI9UeFSZ7DaBv4QE"
const bot = new TelegramBot(API_KEY_BOT, { polling: true })

const myCommands = [
    {
        command: "start",
        description: "Запустить бота"
    },
    {
        command: "help",
        description: "Раздел помощи"
    }
]

const botMenu = {
    reply_markup: {
        keyboard: [
            ['Задание 1', 'Задание 2'],
            ['Задание 3', 'Задание 4'],
            ['Задание 5'],
            ['Закрыть меню']
        ],
        resize_keyboard: true
    }
}

const taskOneMenu = {
    reply_markup: {
        keyboard: [
            ['Тестирование'],
            ['Программирование'],
            ['Соревнования'],
            ['Назад']
        ],
        resize_keyboard: true
    }
}

bot.setMyCommands(myCommands)

let taskTwo = false
let taskThree = false
let marker = ""
bot.on("message", async data => {
    try {
        let chatId = data.chat.id
        let text = data.text

        if (text.startsWith("/start")) {
            await bot.sendMessage(chatId, "Добро пожаловать, " + data.from.first_name + "!")
            await bot.sendMessage(chatId, "Меню бота", botMenu)
        }

        if (!taskThree && !taskTwo) {
            switch (text) {
                case "/help":
                    bot.sendMessage(chatId, "|      <u>Раздел помощи</u>      |", { parse_mode: "HTML" })
                    setTimeout(() => bot.sendMessage(chatId, "Данный бот создан для сдачи\nлабы, а также в будущем\nбудет прикреплен к\nсайту QuestBoard"), 500)
                    break
                
                case "Задание 1":
                    await bot.sendMessage(chatId, "Задание 1", taskOneMenu)
                    break

                case "Задание 2":
                    taskTwo = true
                    break
                
                case "Тестирование":
                    await bot.sendMessage(chatId, "|   Топ 3 сайта для тестирования   |")
                    await bot.sendMessage(chatId, "<b>1.</b> <a href='https://certification.mail.ru/tests/'><i>Mail.ru Certification</i></a>\n<b>2.</b> <a href='https://intester.com/ru'><i>In tester</i></a>\n<b>3.</b> <a href='http://www.quizful.net/test'><i>Quizful</i></a>", { parse_mode: "HTML", disable_web_page_preview: true })
                    break

                case "Программирование":
                    await bot.sendMessage(chatId, "|   Топ 3 сайта для изучения прогаммирования   |")
                    await bot.sendMessage(chatId, "<b>1.</b> <a href='https://skillbox.ru/'><i>Skillbox</i></a>\n<b>2.</b> <a href='https://itvdn.com/ru'><i>ITVDN</i></a>\n<b>3.</b> <a href='http://gb.ru/'><i>Geekbrains</i></a>", { parse_mode: "HTML", disable_web_page_preview: true })
                    break

                case "Соревнования":
                    await bot.sendMessage(chatId, "|   Топ 3 сайта для соревнований по прогаммированию   |")
                    await bot.sendMessage(chatId, "<b>1.</b> <a href='https://coderbyte.com/'><i>Coderbyte</i></a>\n<b>2.</b> <a href='https://www.codewars.com/'><i>Codewars</i></a>\n<b>3.</b> <a href='https://codefights.com/'><i>CodeFights</i></a>", { parse_mode: "HTML", disable_web_page_preview: true })
                    break

                case "Назад":
                    await bot.sendMessage(chatId, "Меню бота", botMenu)
                    break

                case "Задание 3":
                    taskThree = true
                    break

                case "Задание 5":
                    axios.get("https://reqres.in/api/users/2")
                        .then((response) => {
                            const data = response['data']['data']
                            bot.sendMessage(chatId, "URL - https://reqres.in/api/users/2", { disable_web_page_preview: true })
                            bot.sendMessage(chatId, "<b>Сведения:</b>\n• ID: " + data['id'] + "\n• Email: " + data['email'] + "\n• First name: " + data['first_name'] + "\n• Last name: " + data['last_name'] + "\n• Avatar: " + data['avatar'], { parse_mode: "HTML", disable_web_page_preview: true })
                        })
                    break

                case "Закрыть меню":
                    await bot.sendMessage(chatId, "Меню закрыто", { reply_markup: { remove_keyboard: true } })
                    break
            }
        }

        if (taskTwo) {
            await bot.sendAudio(chatId, "Test test test")
        }

        if (taskThree && marker === "") {
            await bot.sendMessage(chatId, "Привет! Как тебя зовут?")
            text = null
            marker = "0"
        }

        if (text != null && marker === "0") {
            await bot.sendMessage(chatId, "Очень приятно!")
            await bot.sendMessage(chatId, "А сколько тебе лет?")
            text = null
            marker = "1"
        }
        
        if (text != null && marker === "1") {
            await bot.sendMessage(chatId, "Так много!")
            await bot.sendMessage(chatId, "А чем ты любишь заниматься?")
            text = null
            marker = "2"
        }

        if (text != null && marker === "2") {
            await bot.sendMessage(chatId, "Понятненько")
            await bot.sendMessage(chatId, "Ладненько, мне пора. Удачи!")
            text = null
            marker = ""
            taskThree = false
            bot.sendMessage(chatId, "Меню бота", botMenu)
        }
    }

    catch (ERROR) {
        console.log(ERROR)
    }
})