const Discord = require('discord.js');
const cheerio = require('cheerio');
const n = require('request');
const fs = require('fs');

const server = `http://www.doutula.com/search?type=photo&more=1&keyword=`

const client = new Discord.Client();
fs.readFile('./discordtoken',function(err,e){
    console.log(e.toString());
    token = e.toString();
    client.login(token);
});

client.on('ready', () => {

});

client.on('message', msg => {
    let c = msg.content;
    if (c.slice(0, 6) === '怎么发表情包') {
        msg.channel.send({
            "embed": {
                'description': "联想词后面加 .jpg! + 数字 ，数字选填\n 例如： 滑稽.jpg!5 \n 此时一位靓仔路过.jpg!"
            }
        })
    }
    if (/\.jpg/.test(c)) {
        arr = c.split('.jpg');
        console.log(arr);
        if (arr[1] && (/\!|\?|:/.test(arr[1].slice(0,1))) && !isNaN(arr[1].slice(1))) {
            geturl(arr[0], msg.channel, Number(arr[1].slice(1)))
        } else {
            if(/\!|\?|:/.test(arr[1].slice(0,1)))geturl(arr[0], msg.channel);
        }
    }
});

function geturl(name, channel, num) {
    num = num || 1;
    page = 1;
    if (num > 72) {
        page = ~~(num / 72) + 1;
        num = num % 72
    }
    let param = '&page=' + page;
    let url = server + encodeURI(name+param);
    console.log(url)
    n.get(url, function (er, e) {
        if (!e.body) return;
        let $ = cheerio.load(e.body);
        src = $('img.img-responsive')[num - 1];
        if(!src)return;
        console.log(src.attribs['data-original']);
        channel.send(src.attribs['data-original']);
    });
}

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {

});

// Log our bot in