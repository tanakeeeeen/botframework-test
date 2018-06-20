/*-----------------------------------------------------------------------------
A simple Language Understanding (LUIS) bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
var bot = new builder.UniversalBot(connector);

bot.set('storage', tableStorage);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

// const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;
// const LuisModelUrl = '	https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d932bae6-f0fa-4f29-bbee-7084aa2399af?subscription-key=dac29a2c6fa64371b2810b445733ab32&verbose=true&timezoneOffset=540&q=';
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d7555d6e-2d34-444f-bf69-8842cb2b8bf6?subscription-key=dac29a2c6fa64371b2810b445733ab32&verbose=true&timezoneOffset=0&q=';
// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

// Add a dialog for each intent that the LUIS app recognizes.
// See https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-luis 
bot.dialog('GreetingDialog',
    (session) => {
        session.send('You reached the Greeting intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Greeting'
})

bot.dialog('HelpDialog',
    (session) => {
        session.send('You reached the Help intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Help'
})

bot.dialog('CancelDialog',
    (session) => {
        session.send('You reached the Cancel intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Cancel'
})

bot.dialog('天気',
    (session) => {
      session.send('多分晴れかなあ');
      }
).triggerAction({
    matches: '天気'
})


bot.dialog('挨拶',
    (session, args) => {
        session.send('こんにちは！');
        session.endDialog();
    }
).triggerAction({
    matches: '挨拶'
})

bot.dialog('着信時のヘッドセット',
    (session, args) => {
        session.send('ハンドセットが電話機からはずれた状態の場合にハンドセットが有効になっています。\
                      この状態でコールが着信するとハンドセットが有効で通話開始になります。\
                      ヘッドセットボタンを押すことでヘッドセットに切り替わりますが、\
                      ハンドセットがはずれたままの場合には、通話終了後にハンドセットが有効になります。\
                      ハンドセットがきちんと電話機にはまった状態では、\
                      通話開始時にヘッドセットが有効になりますので、注意をお願いします。');
        session.endDialog();
    }
).triggerAction({
    matches: '着信時のヘッドセット'
})

bot.dialog('発信ツールの番号入力規則と検索',
    (session, args) => {
        session.send('発信番号欄に０－９以外の文字をいれないのが仕様となっております。');
        session.endDialog();
    }
).triggerAction({
    matches: '発信ツールの番号入力規則と検索'
})

bot.dialog('電話機の移動申請',
    (session, args) => {
        session.send('必要ありません。');
        session.endDialog();
    }
).triggerAction({
    matches: '電話機の移動申請'
})

bot.dialog('プレイス情報のリスト化した一覧に該当が表示されない(電話機（WDEログイン時）)',
    (session, args) => {
        session.send('ご連絡の2席はトレーニング用の設定になっているため本番ユーザーからは該当のプレイスはでてこないのが正しいです。');
        session.endDialog();
    }
).triggerAction({
    matches: 'プレイス情報のリスト化した一覧に該当が表示されない(電話機（WDEログイン時）)'
})

bot.dialog('発信モジュールの着信番号クリップボードコピー設定が外れていた',
    (session, args) => {
        session.send('ユーザー管理画面の不具合を発見し、2/7夜間に修正しました。');
        session.endDialog();
    }
).triggerAction({
    matches: '発信モジュールの着信番号クリップボードコピー設定が外れていた'
})

bot.dialog('2ndC/Oの際の使用可能時間',
    (session, args) => {
        session.send('2/21はNTT-Comによる番号移設作業があるため、21:00まででお願いします。2/22のKanadeですが、トラブルがない限りは制限はありません。');
        session.endDialog();
    }
).triggerAction({
    matches: '2ndC/Oの際の使用可能時間'
})

bot.dialog('レポート　電話番号が潰される件',
    (session, args) => {
        session.send('3月中旬目途で対応する事になりました。');
        session.endDialog();
    }
).triggerAction({
    matches: 'レポート　電話番号が潰される件'
})

bot.dialog('IMでエラーとなる',
    (session, args) => {
        session.send('不具合となります。今後、修正します。');
        session.endDialog();
    }
).triggerAction({
    matches: 'IMでエラーとなる'
})

bot.dialog('音が途切れる',
    (session, args) => {
        session.send('ヘッドセットを交換して改善しています。');
        session.endDialog();
    }
).triggerAction({
    matches: '音が途切れる'
})
