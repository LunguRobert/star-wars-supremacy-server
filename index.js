const webSocketServerPort = process.env.PORT || 3001;
const express = require('express');
const webSocketServer = require('websocket').server;
const http = require('http');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const server = http.createServer(app);
server.listen(webSocketServerPort);
console.log('listening on port 3001');

const wsServer = new webSocketServer({
    httpServer : server
})

const clients = {};

const getUniqueID = () => {
    return "id" + Math.random().toString(16).slice(2);
}

var state = [];


wsServer.on('request', function(request){
    var userID = getUniqueID();
    console.log(new Date()+ ' Received a new conn from origin '+ request.origin +' . ')

    const connection = request.accept(null, request.origin);

    clients[userID] = connection;

    for(key in clients) {
        clients[key].sendUTF(JSON.stringify({type:'unique_id' ,key:key}));
    }

    console.log('connected: '+ userID + ' in ' + Object.getOwnPropertyNames(clients));

    for(key in clients) {
        clients[key].sendUTF(JSON.stringify({type:'data', updatedState:state}));
        console.log('sent Message to: ', clients[key]);
    }
    connection.on('message', function(message){
        if(message.type === 'utf8'){
            console.log('Received Message: ', message.utf8Data);
            const newMessage = JSON.parse(message.utf8Data);
            console.log(newMessage.type);
            switch(newMessage.type){
                case 'data_create' :
                    const updatedState = [
                        ...state,
                        newMessage.state
                    ]
                    state = JSON.parse(JSON.stringify(updatedState));
                    for(key in clients) {
                        clients[key].sendUTF(JSON.stringify({type:'data', updatedState:state}));
                        console.log('sent Message to: ', clients[key]);
                    }
                    break;
                case 'data_update':
                    state = JSON.parse(JSON.stringify(newMessage.state));
                    for(key in clients) {
                        clients[key].sendUTF(JSON.stringify({type:'data', updatedState:state}));
                        console.log('sent Message to: ', clients[key]);
                    }
                    break;
                case 'get_data':
                    for(key in clients) {
                        clients[key].sendUTF(JSON.stringify({type:'data', updatedState:state}));
                        console.log('sent Message to: ', clients[key]);
                    }
                    break;
                case 'talk_to':
                    for(key in clients){
                            
                            if(key===newMessage.adress){
                                console.log('eu l am trimis ')
                                clients[key].sendUTF(JSON.stringify({type:'talk_to',position:newMessage.position,card:newMessage.card}))
                            }
                    }
                    break;
                case 'talk_to_attacker':
                    for(key in clients){
                            
                        if(key===newMessage.adress){
                            console.log('si eu l am trimis ')
                            if(newMessage.diference || newMessage.diference === 0){
                                clients[key].sendUTF(JSON.stringify({type:'talk_to_attacker',position:newMessage.position,card:newMessage.card,diference:newMessage.diference}))
                            }else {
                                clients[key].sendUTF(JSON.stringify({type:'talk_to_attacker',position:newMessage.position,card:newMessage.card}))
                            }
                        }
                }
                    break;
                    case 'talk_to_anakin':
                        for(key in clients){
                                
                            if(key===newMessage.adress){
                                console.log('si eu l am trimis lu anakin ')
                                    clients[key].sendUTF(JSON.stringify({type:'talk_to_anakin',position:newMessage.position}))
                            }
                    }
                        break;
                    case 'kylo_ren':
                        for(key in clients){
                                
                            if(key===newMessage.adress){
                                console.log('si eu l am trimis lu kylo ')
                                    clients[key].sendUTF(JSON.stringify({type:'kylo_ren',existKylo:newMessage.existKylo}))
                            }
                    }
                        break;
                    case 'hand_cards':
                        for(key in clients){
                                
                            if(key===newMessage.adress){
                                console.log('si eu l am trimis lu kylo ')
                                    clients[key].sendUTF(JSON.stringify({type:'hand_cards',card:newMessage.card,existKylo:newMessage.existKylo,numberOfCards:newMessage.numberOfCards}))
                            }
                    }
                        break;
                    case 'enemyHp':
                        for(key in clients){
                                
                            if(key===newMessage.adress){

                                    clients[key].sendUTF(JSON.stringify({type:'enemyHp',diference:newMessage.diference}))
                            }
                    }
                        break;
                    case 'myHp':
                        for(key in clients){
                                
                            if(key===newMessage.adress){

                                    clients[key].sendUTF(JSON.stringify({type:'myHp',diference:newMessage.diference,sign:newMessage.sign}))
                            }
                    }
                        break;
                    case 'your_turn':
                        for(key in clients){
                            if(key===newMessage.adress){
                                    clients[key].sendUTF(JSON.stringify({type:'your_turn',turn:newMessage.turn}))
                            }
                    }
                        break;
                    case 'my_turn':
                        for(key in clients){
                            if(key===newMessage.adress){
                                    clients[key].sendUTF(JSON.stringify({type:'my_turn',turn:newMessage.turn}))
                            }
                    }
                        break;
                    case 'enemy_force_cards':
                        for(key in clients){
                            if(key===newMessage.adress){
                                    clients[key].sendUTF(JSON.stringify({type:'enemy_force_cards',forceCards:newMessage.forceCards}))
                            }
                    }
                        break;
                    case 'cancel_attack':
                        for(key in clients){
                            if(key===newMessage.adress){
                                    clients[key].sendUTF(JSON.stringify({type:'cancel_attack',cancelAttack:newMessage.cancelAttack}))
                            }
                    }
                        break;

                    case 'no_force_cards':
                        for(key in clients){
                            if(key===newMessage.adress){
                                    clients[key].sendUTF(JSON.stringify({type:'no_force_cards'}))
                            }
                    }
                        break;

                    case 'no_summon':
                        for(key in clients){
                            if(key===newMessage.adress){
                                    clients[key].sendUTF(JSON.stringify({type:'no_summon'}))
                            }
                    }
                        break;

                    case 'will_attack':
                        for(key in clients){
                            if(key===newMessage.adress){
                                    clients[key].sendUTF(JSON.stringify({type:'will_attack',position :newMessage.position}))
                            }
                    }
                        break;

                    case 'will_attack_2':
                        for(key in clients){
                            if(key===newMessage.adress){
                                    clients[key].sendUTF(JSON.stringify({type:'will_attack_2',position :newMessage.position}))
                            }
                    }
                        break;

                    case 'mindTricks':
                        for(key in clients){
                            if(key===newMessage.adress){
                                    clients[key].sendUTF(JSON.stringify({type:'mindTricks',mindTricks :newMessage.mindTricks, who:newMessage.who}))
                            }
                    }
                        break;

                    case 'card_taken':
                        for(key in clients){
                            if(key===newMessage.adress){
                                    clients[key].sendUTF(JSON.stringify({type:'card_taken',position :newMessage.position}))
                            }
                    }
                        break;

                    case 'lastTrashCard':
                        for(key in clients){
                            if(key===newMessage.adress){
                                    clients[key].sendUTF(JSON.stringify({type:'lastTrashCard',lastTrashCard :newMessage.lastTrashCard}))
                            }
                    }
                        break;

                    case 'addToTrash':
                        for(key in clients){
                            if(key===newMessage.adress){
                                    clients[key].sendUTF(JSON.stringify({type:'addToTrash',addToTrash :newMessage.addToTrash}))
                            }
                    }
                        break;

                    case 'my_mana':
                        for(key in clients){
                            if(key===newMessage.adress){
                                    clients[key].sendUTF(JSON.stringify({type:'my_mana',myMana :newMessage.myMana}))
                            }
                    }
                        break;
                    
            }
            
        }
    })

    connection.on('close', function(reasonCode, description) {
        console.log(new Date() + ' Peer ' + userID + ' disconnected.');
        let myCo = false;
        let found = false;
        state.forEach((itm)=>{
            if(found) return;
            if(itm.players['guest'].id === userID){
                myCo = itm.players['host'].id;
                found = true;
            }else if(itm.players['host'].id === userID){
                myCo = itm.players['guest'].id;
                found = true;
            }
        })

        // Remove the connection from the clients object
        delete clients[userID];
        if(myCo){
            let filteredState = state.filter(object => object.players['guest'].id !== userID && object.players['host'].id !== userID);
            state = filteredState;
        }
        for(key in clients){
            if(key===myCo){
                    clients[key].sendUTF(JSON.stringify({type:'enemy_disconnected'}))
            }
        }
        // Update the state for the other clients
    for (key in clients) {
        clients[key].sendUTF(JSON.stringify({type: 'data', updatedState: state}));
        }
    
    });
})
