const path = require('node:path');
const readline = require("node:readline");
const fs = require("node:fs/promises");
const os = require("node:os");
const EventEmitter = require("node:events");
const http = require('node:http');

//    PATH module

// async function foo(){
//     try {
//         console.log(__filename);
//         console.log("basename: " + path.basename(__filename));
//         console.log("dirname: " + path.dirname(__filename));
//         console.log("extname: " + path.extname(__filename))
//         console.log(path.parse(__filename))
//         console.log(path.join(__dirname,'foo','bar'));
//         console.log(path.normalize('D:\\\\\Tetiana\\IdeaProjects\\\\nodejs-lessons'));
//         console.log(path.isAbsolute('D:\\Tetiana\\IdeaProjects\\nodejs-lessons'));
//     }catch (e) {
//         console.error(e);
//     }
// }

//  READLINE module

// async function foo(){
//     try {
//         const line = readline.createInterface({
//              input: process.stdin,
//             output: process.stdout
//         });
//
//        await line.question("Enter your name: ",(name)=>{
//            console.log(`Hello ${name}`)
//            line.close();
//         } )
//
//     }catch (e) {
//         console.error(e);
//     }
// }

//  FS module

// async function foo(){
//     try {
//         const pathToFile = path.join(__dirname,'text.txt');
//
//        // await fs.writeFile(pathToFile,"Some data ...");
//
//         // const data = await fs.readFile(pathToFile,'utf-8');
//         // console.log(data)
//
//         // await fs.appendFile(pathToFile,"\n Hello!")
//
//         // await fs.rename(pathToFile,path.join(__dirname,'file.txt'));
//
//         // await fs.mkdir(path.join(__dirname,'foo','bar'),{recursive:true})
//
//         // await fs.writeFile(path.join(__dirname, 'foo','bar', 'index.js'),'');
//
//         // await fs.rmdir(path.join(__dirname,'foo', 'bar'),{recursive:true});
//
//         // await fs.unlink(path.join(__dirname,'foo','bar','index.js'));
//
//         // await fs.copyFile(path.join(__dirname,'file.txt'),path.join(__dirname,'foo','bar','copiedFile.txt'))
//
//         const stats = await fs.stat(path.join(__dirname));
//         console.log(stats)
//     }catch (e) {
//         console.error(e);
//     }
// }

//    OS module
// async function foo(){
//     try {
//         console.log(os.cpus())
//         console.log(os.homedir())
//         console.log(os.hostname())
//         console.log(os.version())
//         console.log(os.platform())
//         console.log(os.machine())
//         console.log(os.uptime() / 60 / 60 / 24)
//     }catch (e) {
//         console.error(e);
//     }
// }

//    EVENTS module
// async function foo(){
//     try {
//         const emitter = new EventEmitter();
//
//         emitter.on('emit1',(...args) => {
//             console.log('an event occured: ', args)
//         });
//
//         emitter.once('emit2',()=>{
//             console.log('Once-event occurred. ')
//         })
//
//         emitter.emit('emit1',45,55);
//         emitter.emit('emit2');
//         emitter.emit('emit1',77,56587465);
//         emitter.emit('emit1','hello','Tanya');
//         emitter.emit('emit2');
//
//     }catch (e) {
//         console.error(e);
//     }
// }

async function foo(){
    try {
        const server = http.createServer((req, res)=>{
            res.end('okay');
        });

        server.listen(3000,'0.0.0.0',()=>{
            console.log(`Server is running at http://0.0.0.0:3000/`);
        })


    }catch (e){
        console.error(e);
    }

}


void foo();
