import {Command} from "../commandUtilities.js";
import {createRequire} from "module";
import { channel } from "diagnostics_channel";
const require = createRequire(import.meta.url);
const {EmbedBuilder} = require('discord.js')
const compile = new Command (
    'cmds/help.js' , 2 , 'compile'
)

const inputEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Input Mode')
    .setDescription("Your program Requires an input! \nYou can input a *Number* or a *Single Character*, otherwise you'll get a Runtime error.\n")
    .addFields(
        { name: 'How2Exit input mode?', value:  "Input .exit if you want to finish the program execution"},
    )
    .setTimestamp()
    .setFooter({ text: 'BrainHugBot', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

const run = async (code,message,flags) => {

    console.log('initializing compilation');
    const channel = message.channel;

    const compilingResults = {state: 'Successful', info: "The execution of the program was successful and 0 errors were found", output: "None", time: "None"};

    //Verifying that every '[' loop has its closing bracket ']'
    const bracketStack = []
    //Creating 2 hashmaps for saving the positions of the brackets

    //returns the closing bracket position
    const mapClosing = new Map();
    //returns the opening bracket position
    const mapOpening = new Map();
    for(let x = 0; x<code.length;x++) {
        if(code[x] === '['){
            bracketStack.push(x);
        }
        if(code[x] === ']'){
            if(bracketStack.length!=0){
                const bracketFirst = bracketStack.pop();
                mapClosing.set(bracketFirst,x);
                mapOpening.set(x,bracketFirst);
            }
            else{
                compilingResults['state'] = 'Compiling Error';
                compilingResults['info'] = `Expected '[' before the closing bracket at position ${x}\n `;
                break;
            }
        }
    }
    if(bracketStack.length!=0){
        compilingResults['state'] = 'Compiling Error';
        compilingResults['info'] = `Expected '[' to match the closing bracket at position ${bracketStack.pop()}`;
    }
    

    //initializing memory, pointers, the output array and the loopStack
    let ptr = 0;
    let memory = Array(100000).fill(0);
    let output = []
    let i = 0;

    //filter for the input mode
    const filter = m => {
        console.dir(m)
        return m.author==message.author;
    };
    
    //setting a timestamp 
    const startTime = new Date().getTime();
    let timeStamp =0;
    while(i<code.length && compilingResults['state'] === 'Successful'){
        timeStamp = new Date().getTime()
        if(timeStamp-startTime>10000){
            compilingResults['state'] = 'Runtime ERROR';
            compilingResults['info'] = "The runtime execution exceeded the 10 seconds default limit";
        }
        if(ptr<0){
            compilingResults['state'] = 'Runtime ERROR';
            compilingResults['info'] = 'Pointer position out of range';
        }
        switch(code[i]){
            case '>':
                ptr++;
                break;
            case '<':
                ptr--;
                break;
            case '+':
                //console.log(`byte at position ${ptr} ++`);
                memory[ptr]++;
                break;
            case '-':
                //console.log(`byte at position ${ptr} --`);
                memory[ptr]--;
                break;
            case '[':
                 if(memory[ptr]==0){
                    i = mapClosing.get(i);
                 }             
                 break;
             case ']':
                if(memory[ptr]!=0){
                    i = mapOpening.get(i)
                }
                break;
            case ',':
                channel.send({embeds: [inputEmbed]})
                console.log(`Input at byte ${ptr}`);
                try{
                    let promise = await channel.awaitMessages({filter,max:1,time: 10000, errors:['time']});
                    let value = promise.first().content;
                    if(value === '.exit'){
                        channel.send("Finishing Program Execution!");
                        compilingResults['state'] = 'Stopped';
                        compilingResults['info'] = 'The user has stopped the program execution';
                    }
                    else if(value.length > 1 && Number.isNaN(parseInt(value))){
                        channel.send("Sorry, you can only input a single Character or a Number. Try Compiling Again");
                        compilingResults['state'] = 'Runtime Error';
                        compilingResults['info'] = 'Invalid Input.';
                    }
                    else{
                        console.log(parseInt(value));
                        if(Number.isNaN(parseInt(value))) value = value.charCodeAt(0);
                        memory[ptr] = parseInt(value);
                    }
                    

                }
                catch(e){
                    //console.log(e);
                    compilingResults['state'] = 'Runtime Error';
                    compilingResults['info'] = 'The 10 second limit for sending your input was exceeded.';

                }
                break;
            case '.':
                let val = memory[ptr];
                if(flags[0] == "-a"){
                    val = String.fromCharCode(val);
                }
                output.push(val);
                break;
        }
        //console.log(i);
        //hehe
        i++;

    }
    console.log(output);

    

    if(compilingResults['state']==="Successful"){
        compilingResults['time'] = (timeStamp - startTime)/1000;
        compilingResults['output'] = output.toString();
    }

    return compilingResults;
}






compile.trigger = async (message, code , rawFlags, extra = []) => {
    let channel =message.channel;
    let compilingFlags = [];
    if(rawFlags !== undefined) {
        console.log('lol');
        compilingFlags = rawFlags.split(",");
        console.dir(compilingFlags);
    }

    
    console.log(code);
    let compilingResults = null;
    await run(code,message,compilingFlags).
        then( value => {    
            compilingResults = value;

        });
    
    console.log('finished');
    console.log(compilingResults);
    let color = 0xC70039; 
    if(compilingResults['state'] === 'Successful'){
        color = 0xAAFF00;
    }
    
    const compilingResultsEmbed = new EmbedBuilder()
    .setColor(color)
    .setTitle(compilingResults['state'])
    .setDescription(compilingResults['info'])
    .addFields(
        { name: 'Output', value:  compilingResults['output']},
        { name: 'Execution Time', value: `${compilingResults['time']}`, inline: true },
        { name: 'State', value: compilingResults['state'], inline: true },
    )
    .setTimestamp()
    .setFooter({ text: 'BrainHugBot', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
    channel.send({embeds: [compilingResultsEmbed]});


}

export {compile}
