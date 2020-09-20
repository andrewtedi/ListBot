var array = [];
var arrayTitle = "";
var numbered = false;

var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1); //command is not included in the args array!
		var string = "";
		for(var i =0; i < args.length; i++) {
			string += args[i];
			if(i != args.length -1)
				string += " ";
		}
		args = string.split(", ");
		logger.info(args);
        switch(cmd) {
            // !ping -  simple test
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
			break;
			// !titleList - give list a title
			case 'titleList':
				if (args.length > 1) {
					bot.sendMessage({
						to: channelID,
						message: 'Only one argument!'	
					});
				}
				else if (args.length == 0 || args[0] == "") {
					bot.sendMessage({
						to: channelID,
						message: 'Requires argument!'
					});
				}
				else { 
					arrayTitle = args[0];
					bot.sendMessage({
						to: channelID,
						message: 'Title Changed!'
					});
				}
			break;
			// !deleteTitle - deletes title
			case 'deleteTitle':
				arrayTitle = "";
				bot.sendMessage({
					to: channelID,
					message: 'Title deleted!'
				});
			break;
			// !print - print list with title
			case 'print':
				if (arrayTitle == ""){
					bot.sendMessage ({
						to: channelID,
						message: 'Title not set! List cannot be displayed!'
					});
				}
				else {
					var list = arrayTitle + '\n';
					for(var i = 0; i < array.length; i++) {
						if(numbered) {
							i++;
							list += '\n ' + i + '. ';
							i--;
						}
						else
							list += '\n - ';
						list += array[i];
					}
					bot.sendMessage({
						to: channelID,
						message: list
					});
				}
            break;
			// !addLast - adds items to the end of the array
			case 'addLast':
				if (args.length == 0 || args[0] == "") {
					bot.sendMessage({
						to: channelID,
						message: 'Requires argument!'
					});
				}
				else { 
					for(var i = 0; i < args.length; i++) {
						array.push(args[i]);
					}
					bot.sendMessage({
						to: channelID,
						message: 'Item(s) added at end of List!'
					});
				}
			break;
			// !deleteLast - removes last item in array
			case 'deleteLast':
				if (array.length == 0) {
					bot.sendMessage({
						to: channelID,
						message: 'List is empty!'
					});
				}
				else {
					array.pop();
					bot.sendMessage ({
						to: channelID,
						message: 'Last item deleted!'
					});
				}
			break;
			// !addItemLoc - adds item at specified location
			case 'addItemLoc':
				if(args.length != 2 || isNaN(args[1]))
					bot.sendMessage ({
						to: channelID,
						message: 'Requires a number and a string argument! !addItemLoc <newItem>, <#>'
					});
				else if(args[1] > array.length || args[1] < 1)
					bot.sendMessage ({
						to: channelID,
						message: 'Item at inputed index does not exist!'
					});
				else {
					array.splice(args[1] - 1, 0, args[0]);
					bot.sendMessage ({
						to: channelID,
						message: 'Item added at specified location!'
					});
				}
			break;
			// !deleteItem - deletes item given as first argument 
			case 'deleteItem':
				var integer = null;
				for(var i = 0; i < array.length; i++) {
					if(args[0] == array[i])
						integer = i;
				}
				if(integer == null)
					bot.sendMessage({
						 to: channelID,
						 message: 'Item does not exist in list!'
					});
				else {
					array.splice(integer, 1);
					bot.sendMessage ({
						to: channelID,
						message: 'Item deleted!'
					});
				}
			break;
			// !deleteItemLoc - deletes an item at a specific location in the array
			case 'deleteItemLoc':
				if(args.length != 1 || isNaN(args[0]))
					bot.sendMessage ({
						to: channelID,
						message: 'Requires a number argument! !deleteItemLoc <#>'
					});
				else if(args[0] > array.length || args[0] < 1)
					bot.sendMessage ({
						to: channelID,
						message: 'Item at inputed index does not exist!'
					});
				else {
					array.splice(args[0] - 1, 1);
					bot.sendMessage ({
						to: channelID,
						message: 'Item deleted at specified location!'
					});
				}
			break;
			// !deleteAll - deletes all items in array or makes another array
			case 'deleteAll':
				array = [];
				bot.sendMessage ({
					to: channelID,
					message: 'All items in list deleted!'
				});
			break;
			// !changeItem - changes old item into new item
			case 'changeItem':
				var integer = null;
				for(var i = 0; i < array.length; i++) {
					if(args[1] == array[i])
						integer = i;
				}
				if(integer == null)
					bot.sendMessage({
						 to: channelID,
						 message: 'Item does not exist in list!'
					});
				else {
					array[integer] = args[0];
					bot.sendMessage({
						 to: channelID,
						 message: 'Item changed!'
					});
				}		
			break;
			// !changeItemLoc - changes item at location given with new item
			case 'changeItemLoc':
				if(args[0] > array.length || args[0] < 1)
					bot.sendMessage({
						to: channelID,
						message: 'Location does not exist!'
					});
				else if(args.length > 2 || args.length < 2 || isNaN(args[1]))
					bot.sendMessage ({
						to: channelID,
						message: 'Requires two arguments! !changeItemLoc <newItem>, <#>'
					});
				else {
					array[args[1] - 1] = args[0];
					bot.sendMessage ({
						to: channelID,
						message: 'Item at specified location changed!'
					});
				}	
			break;
			// !swap - swaps two items by specified location, both locations must exist
			case 'swap':
				if(args.length != 2 || isNaN(args[0]) || isNaN(args[1]))
					bot.sendMessage ({
						to: channelID,
						message: 'Requires two number arguments! !itemAt <#>, <#>'
					});
				else if(args[0] > array.length || args[0] < 1 || args[1] > array.length || args[1] < 1)
					bot.sendMessage ({
						to: channelID,
						message: 'Item(s) at inputed index does not exist!'
					});
				else {
					var n = array[args[0] - 1];
					array[args[0] - 1] = array[args[1] - 1];
					array[args[1] - 1] = n;
					bot.sendMessage ({
						to: channelID,
						message: 'Items swapped!'
					});
				}	
			break;
			// !itemAt - prints the item in an index of an array
			case 'itemAt':
				if (isNaN(args[0]))
					bot.sendMessage ({
						to: channelID,
						message: 'Only accepts a number as an argument! !itemAt <#>'
					});
				else {
					if(args[0] < 1 || args[0] > array.length) {
						bot.sendMessage ({
							to: channelID,
							message: 'Item at inputed index does not exist!'
						});
					}
					else
						bot.sendMessage ({
							to: channelID,
							message: 'The item at index ' + args[0] + ' is: ' + array[args[0] - 1]
						});
				}
			break;
			// !length - prints current length of array
			case 'length':
				bot.sendMessage({
					to: channelID,
					message: 'The current length of the list is: ' + array.length
				});
			break;
			// !switchNumHyph - switches between numbered list or unordered hyphenated list
			case 'switchNumHyph':
				numbered = !numbered;
				bot.sendMessage({
					to: channelID,
					message: 'Switched! Numbered list is now: ' + numbered
				});
			break;
			// !randomize - randomizes list
			case 'randomize':      
				var currentIndex = array.length, temp, index;  
				while (0 !== currentIndex) {  
					index = Math.floor(Math.random() * currentIndex);  
					currentIndex--;  
					temp = array[currentIndex];          
					array[currentIndex] = array[index];          
					array[index] = temp;      
				} 
				bot.sendMessage({
					to: channelID,
					message: 'List Randomized!'
				});
            break;    
			// !printArray - prints array in non-list format
			case 'printArray':
				var list = '';
				for(var i = 0; i < array.length - 1; i++) {
					list += array[i];
					list += ', ';
				}
				list += array[array.length - 1];
				bot.sendMessage({
					to: channelID,
					message: list
				});
			break;
			// !help - prints command list
			case 'help':
				var msg = "ListBot V. 1.0.1\n\nAll ListBot Commands\n\n" +
					"!ping - simple test\n" +
					"!titleList <String> - give list a title\n" +
					"!deleteTitle - deletes title\n" +
					"!print - print list with title\n" +
					"!addLast <String>, <String>, <String>,... - adds items to the end of the array\n" +
					"!deleteLast - removes last item in array\n" +
					"!addItemLoc <String>, <Integer> - adds item at specified location\n" +
					"!deleteItem <String> - deletes item given as first argument\n" +
					"!deleteItemLoc <Integer> - deletes an item at a specific location in the array\n" +
					"!deleteAll - deletes all items in array\n" +
					"!changeItem <String>, <String> - changes old item into new item\n" +
					"!changeItemLoc <String>, <Integer> - changes item at location given with new item\n" +
					"!swap <Integer>, <Integer> - swaps two items by specified location, both locations must exist\n" +
					"!itemAt <Integer> - prints the item in an index of an array\n" +
					"!length - prints current length of array\n" +
					"!switchNumHyph - switches between numbered list or unordered hyphenated list\n" +
					"!randomize - randomizes list\n" +
					"!printArray - prints array in non-list format\n" +
					"!help - prints command list";
				bot.sendMessage({
					to: channelID,
					message: msg
				});	
			break;
            // Just add any case commands if you want to..
         }
     }
});