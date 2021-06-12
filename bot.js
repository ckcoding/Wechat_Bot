const { Wechaty } = require('wechaty')
const axios = require('axios')
//const QrcodeTerminal = require('qrcode-terminal')
const QRCode = require('qrcode');
const bot = new Wechaty()
function qrcodes(url) {  
  return new Promise((resolve, reject)=>{
  
  // resolve(qr_svg)
//     QrcodeTerminal.generate(url, { small: true }, function (res) {
//       resolve(res)
//       console.log(`请扫码登录以下二维码
  
// ${res}`)})
QRCode.toDataURL(url)
  .then(res => {
    resolve(res)
  })
})
}
process.on('message', (res) => {
  console.log(res);
})
bot.on('scan', (qrcode, status) => {
  console.log(`第${status - 1}次生成链接中`);
  qrcodes(qrcode).then((res)=>{
    process.send(res)
  })
})

bot.on('login', user => { bot.say(`用户 ${user.payload.name}:登录成功!`) })
bot.on('message', async message => {
let me = await message.self()
// const tests2 = await message.self()
// console.log(tests2);

//await message.say("data")
  const contact = message.talker()
  const text = message.text()
  const room = message.room()
  const to = message.to().name()
  const textid = message.payload.text
  console.log(message);
  console.log(message.id);
  const rev = await bot.Message.find({ id: textid })
  if (rev != null) {
    const text = rev.payload.text

    if (room) {
      const topic = await room.topic()
      console.log(`————————撤回的消息———————————
    💬来自群: ${topic} 
    🗿昵称: ${contact.name()} 
    📜消息: ${text}
    
    `)
      data = `这个B撤回了一条消息

💬来自群: ${topic} 

🗿昵称: ${contact.name()}

📩发给：${to}

📜消息: ${text}`
      say('@老K', data)
    } else {
      console.log(`———————————撤回的消息———————————
    🗿昵称: ${contact.name()} 
    📩发给：${to}
    📜消息: ${text}
    `)
      data = `这个B撤回了一条消息
    
🗿昵称: ${contact.name()}

📩发给：${to}

📜消息: ${text}`
      say('@老K', data)

    }
  } else {
    if (room) {
      const topic = await room.topic()
      console.log(`——————————————————————
    💬来自群: ${topic} 
    🗿昵称: ${contact.name()} 
    📜消息: ${text}
    
    `)

    } else {
      console.log(`——————————————————————
    🗿昵称: ${contact.name()} 
    📩发给：${to}
    📜消息: ${text}
    `)
    if(me){
      return
    }else{
        console.log(`http://api.qingyunke.com/api.php?key=free&appid=0&msg=${text}`)
        const url = encodeURI(`http://api.qingyunke.com/api.php?key=free&appid=0&msg=${text}`)
      axios(url).then(async (res)=>{
          console.log(res.data)
        await message.say(res.data.content)
      })
    
    }
    }

  }

})



bot.on('friendship', async friendship => {
    var Friendship = await bot.Friendship
    switch (friendship.type()) {
    // 1. New Friend Request
    case Friendship.Type.Receive:
      await friendship.accept()
      const firsays = await friendship.contact()
    const id = await firsays.id
    console.log(id);

      await sayid(id,`你好，我是机器狗柴犬
目前我已经可以和你进行一些简单的沟通了

我的主人也正在努力教会我其他技能喔！`)
      break
    // 2. Friend Ship Confirmed
    case Friendship.Type.Confirm:
      console.log(`friend ship confirmed`)
      break
    }

})
bot.on('userSelf', userSelf => { console.log(`用户信息: ${userSelf}`) })
bot.on('logout', logout => {
  console.log(`用户 ${logout.payload.name}:退出登录!`)
  bot.stop()
  process.exit(process.pid)
})
async function say(name, data) {
  console.log(data);
  const contact = await bot.Contact.find({ name: name })
  contact.say(data)
}
async function sayid(ids, data) {

const contact = await bot.Contact.load(ids)
await contact.sync()
await  contact.say(data)
}


bot.start()
