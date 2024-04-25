const http = require("node:http");
const {reader, writer} = require("./fs.service");
const express = require("express");
const app = express();

app.use(express.json()); // application/json
app.use(express.urlencoded({extended: true})); //application/x-www-form-urlencoded


// const users = [
//     {id:1, name:'Robert', age:27},
//     {id:2, name:'Yulia', age:33},
//     {id:3, name:'Lily', age:19},
//     {id:4, name:'Oliver', age:44}
// ]

// with express

app.get('/', (req, res) => {
    res.status(200).send('hello');
})
app.get('/users', async (req, res) => {
    const users = await reader();
    res.json(users);
})

app.get('/users/:id', async (req, res) => {
    const userId = Number(req.params.id);
    const users = await reader();

    const foundedUser = users.find((user) => user.id === userId);

    if (!foundedUser) {
        res.status(404).json("User was not found.")
    }
    res.status(200).send(foundedUser);
})

app.post('/users', async (req, res) => {
    const {name, age} = req.body;

    const users = await reader();

    const newUser = {
        id: users[users.length - 1].id + 1,
        name,
        age
    }
    users.push(newUser)

    await writer(users);

    res.status(201).json(newUser);
})

app.delete('/users/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const users = await reader();

        const index = users.findIndex(user => user.id === +id);

        if (index === -1) {
            throw new Error(`User with ID ${id} was not found`);
        }

        users.splice(index, 1);
        await writer(users);
        res.status(204).json("User was successfully deleted");
    } catch (e) {
        res.status(404).json(e.message);
    }
})

app.put('/users/:id', async (req, res)=>{
    try {
        const id = Number(req.params.id);
        const {name, age} = req.body;

        const users = await reader();

        const index = users.findIndex(user => user.id === id);

        if (index === -1){
            throw new Error(`User with ID ${id} was not found`);
        }

        users[index] = {...users[index], name, age };
        await writer(users);
        res.status(201).json(users[index]);

    }catch (e) {
        res.status(404).json(e.message);
    }


})
app.listen(3000, '0.0.0.0', () => {
    console.log('Server running');
})

// without express
// async function httpFunc(){
//     try {
//         const server = http.createServer((req, res)=>{
//             if (req.method === 'GET' && req.url === '/users'){
//                 res.end(JSON.stringify(users));
//             }
//             res.end('hello new server');
//         })
//
//         server.listen(3000, ()=>{
//             console.log('Server is running at http://localhost:3000/');
//         })
//     }catch (e) {
//         console.error('An error occurred: ' + e);
//     }
// }
//
// void httpFunc();
