const cp = require('child_process');
const bots = cp.fork('bot.js');
const Koa = require('koa');
const app = new Koa();
function getdata(){
    return new Promise((resolve,rejects)=>{
        bots.on('message', (res)=>{
            if(res == null){
                resolve("还未启动")
            }
            resolve(res)
        })
    })
}
bots.send('开启子进程')
app.use(async ctx => {
    if(ctx.request.method == 'GET'){
        ctx.body = `
        <div id="hello"></div>
        <script>
        var dom = document.getElementById("hello")
        dom.innerHTML = '<image src="${`${await getdata()}`}"/>'
        </script>
            `       
}
    else{ctx.body = `不支持Post请求`;}
})
app.listen(2333);
