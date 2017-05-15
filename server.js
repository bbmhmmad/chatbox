var express = require ('express')
var app = express()

var path=require('path')

app.set('views', path.join(__dirname,'./views'));
app.set('view engine','ejs')

app.get('/',function(req,res){
	res.render('index')
})

var server =app.listen(process.env.PORT || 8000,function(){
	'Port is listening on 8000'
})

var message_objects = []

var io=require('socket.io').listen(server)

io.sockets.on('connection',function(socket){
	console.log('We are using sockets');
	console.log(socket.id);
	socket.on('new_user',function(data){
		console.log('GOT NAME',data.data)
		socket.broadcast.emit('announcement',{newbie:data.data,all_messages:message_objects})
	})

	socket.on('new_message',function(data){
		console.log('DID WE GET new_message INFO',data.name,data.message)
		message_objects.push({name:data.name,message:data.message})
		console.log('MESSAGE OBJECTS',message_objects)
		io.emit('show_message',{all_messages:message_objects})
	})

})