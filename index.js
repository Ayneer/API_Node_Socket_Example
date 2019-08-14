const express = require('express');
const app = express();

const bodyParse = require('body-parser');

const http = require('http').createServer(app);

const socket = require('socket.io')(http);

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParse.urlencoded({extended: false}));
app.use(express.json());

app.post('/consumo', (req, res)=>{

    //recorro el array de clientes
    clientesActivos.forEach((cliente)=>{
        //si el cliente se encuentra activo...
        if(cliente['idC'] === req.body['idCliente']){
            //emito el consumo que trae el medidor
            socket.to(cliente['idS']).emit('consumo', req.body['consumo']);
        }
    });

    res.status(200).send("consumo recibido con exito!");
});

let clientesActivos = [];
let consumo = "12";

socket.on('connection', function(socketClient){
    console.log('Se conecto un nuevo cliente!');
    

    socketClient.on('cliente', (idCliente)=>{
        
        clientesActivos.push({ idC : idCliente, idS : socketClient.id});
        console.log('Cliente añadido..', clientesActivos);

        if(idCliente === "1"){
            socketClient.emit('consumo', 12);
        }else{
            if(idCliente === "2"){
                socketClient.emit('consumo', 50);
            }
        }
        
    });


    //para enviar a todos los sockets clientes que esten activos!
    //socket.sockets.emit('mensaje', mensajes);
});


http.listen(8080, ()=>{
    console.log("escuchando en http://localhost:8080/");
});
