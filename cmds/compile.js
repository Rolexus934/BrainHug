import {Command} from "../commandUtilities.js";
import {createRequire} from "module";
import { channel } from "diagnostics_channel";
const require = createRequire(import.meta.url);
const compile = new Command (
    'cmds/help.js' , 2 , 'compile'
)



const run = async (code,message,flags) => {
    console.log('initializing compilation');
    const channel = message.channel;

    const compilingResults = {state: 'Successful', info: "The execution of the program was successful and 0 errors were found"};

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
    



    while(i<code.length && compilingResults['state'] === 'Successful'){
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
                console.log(`byte at position ${ptr} ++`);
                memory[ptr]++;
                break;
            case '-':
                console.log(`byte at position ${ptr} --`);
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
                channel.send("Your program Requires an input! \nYou can input a Number or a Single Character, otherwise you'll get a Runtime error\nInput .exit if you want to finish the program execution).")
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
                    console.log(e);
                    channel.send("Time limit exceeded!");
                    compilingResults['state'] = 'Runtime Error';
                    compilingResults['info'] = 'The 10 second limit for sending your input was exceeded.';

                }
                break;
            case '.':
                console.log(`output byte at position ${ptr}`);
                output.push(memory[ptr]);
                break;
        }
        console.log(i);
        //hehe
        i++;

    }
    console.log(output);

    if(compilingResults['state']==="Successful"){
        compilingResults['output'] = output.toString();
    }

    return compilingResults;
}






compile.trigger = async (message, code , rawFlags, extra = []) => {
    let channel =message.channel;
    const compilingFlags = rawFlags.slice(",");
    let n = compilingFlags[0];
    
    console.log(code);
    let compilingResults = null;
    await run(code,message,compilingFlags).
        then( value => {    
            compilingResults = value;

        });
    
    console.log('finished');
    console.log(compilingResults);
    channel.send(`${compilingResults['info']}\n Output: ${compilingResults['output']}`);

}

export {compile}
