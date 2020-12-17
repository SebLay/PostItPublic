const MessagesModel = require("../modele/messageDB")
const pool = require ("../modele/database");

module.exports.getMessage = async(req, res)=>{
    const client = await pool.connect();
    const {userid_receiver, userid_sender} = req.body;
    
    try{
        const {rows:messages} = await MessagesModel.getMessage(userid_receiver, userid_sender,client);
        messageTrouble = false;
        messages.forEach(message => {
            check = (message !== undefined);   
            if(!check){
                messageTrouble = true;
            }
        });
        if(!messageTrouble){
            res.json(messages)
        }
        else{
            res.sendStatus(400);
        }
    }
    catch(error){
        res.sendStatus(500);
    }
    finally{
        client.release();
    }
}

module.exports.addMessage = async(req,res) =>{
    const client = await pool.connect();
    const{userid_receiver, userid_sender, content} = req.body;
    try{
        const reponse = await MessagesModel.addMessage(userid_receiver,userid_sender, content, client);
        if(reponse){
            res.sendStatus(201);
        }
        else{
            res.sendStatus(400);
        }
    }
    catch(error){
        res.sendStatus(500);
    }
    finally{
        client.release();
    }
}

module.exports.updateMessage = async(req,res) =>{
    const client = await pool.connect();
    const {id, userid_receiver,userid_sender, content} = req.body;
    try{
        const reponse = await MessagesModel.updateMessage(id, userid_receiver, userid_sender, content, client);
        if(reponse){
            res.sendStatus(204);
        }
        else{
            res.sendStatus(500);
        }
    }
    catch(error){
        res.sendStatus(500);
    }
    finally{
        client.release();
   }
}

module.exports.deleteMessage = async (req,res) =>{
    const client = await pool.connect();
    const {id, userid_receiver,userid_sender}= req.body;
    try{
        const reponse = await MessagesModel.deleteMessage(id, userid_receiver, userid_sender, client);
        if(reponse){
            res.sendStatus(204);
        }
        else{
            res.sendStatus(500);
        }
    }
    catch(error){
        res.sendStatus(500);
    }
    finally{
        client.release();
    }
}