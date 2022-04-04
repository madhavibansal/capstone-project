const express = require("express")
const amqp=require("amqplib");

const app =  express()
app.use(express.json())
const rabbitsetting = {
    protocol:'amqp',
    hostname:'localhost',
    port:5672,
    username:'guest',
    password:'guest',
    vhost:'/',
    authMechanism:['PLAIN','AMQPLAIN','EXTERNAL']
}


const connect = async () => {
    const queue = "notification";
        try{
        const conn = await amqp.connect(rabbitsetting);
        console.log("connection created");
        const channel = await conn.createChannel();
        console.log("channel created");
        const res = await channel.assertQueue(queue);
        console.log("queue created");

        app.get("/get-notification/:userId", async (req,res) => {
            channel.consume(queue,message =>{
                let client = JSON.parse(message.content.toString());
                for (let i=0; i<client.length; i++){
                    console.log(client[i].userId)
                    const id = req.params.userId
                    console.log(id)
                    if(id == client[i].userId){
                        const userNotification = client[i]
                        res.json({userNotification})
                        break
                        
                    }
                    
                }
                
                console.log(`Received message ${client.name}`)
                res.json({client})
                channel.ack(message);
               
        })
        })
    }catch(err){
        console.error(`ERROR -> ${err}`);
    }
        
}

connect().then((err,res) => {
    if(err) console.log(err)
    console.log("successful")
})

app.listen(8000,() => {
    console.log(`server is listening on 8000`)
})


