const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length - 14;

const workers = []

/*
When we run the app.js program an OS process is created that starts running our code.
At the beginning the cluster mode is imported const cluster = require('cluster') 
and in the if sentence we check if the isMaster property. 
Because the process is the first process the isMaster property is true 
and then we run the code of masterProcess function. 
*/

if(cluster.isMaster){
    console.log("Invoking master as no child is present. ")
    masterProcess();
}else{
    console.log("Invoking child as it is present. ")
    childProcess();
}

/*
   This function has not much secret, it loops depending on the number of CPUs of your machine 
   and forks the current process using the cluster.fork() method.
   What the fork() really does is to create a new node process, 
   like if you run it via command line with $node app.js, 
   that is you have many processes running your app.js program.
 */

function masterProcess(){
    console.log(`Master ${process.pid} is running`);

    for(let i = 0; i < numCPUs; i++){
        console.log(`Forking process number ${i}...`);

        const worker = cluster.fork();

        workers.push(worker)

        worker.on('message', function(message){
            console.log(`Master ${process.pid} receives message '${JSON.stringify(message)}' from worker ${worker.process.pid}`)
        })
    }

    workers.forEach(function(worker){
        console.log(`Master ${process.pid} sends message to worker ${worker.process.pid} ...`)

        worker.send({msg: `Message from master ${process.pid}` });
    }, this);

    // process.exit();
}

/* When a child process is created and executed, it does the same as the master, 
 *  that is, imports the cluster module and executes the if statement. 
 *  Once of the differences is for the child process the value of cluster.isMaster is false, 
 *  so they ends running the childProcess function. 
*/

/** Note, we explicitly terminate the master and worker processes with process.exit(), which by default return value of zero. */

function childProcess(){
    console.log(`Worker ${process.pid} started`);
    
    process.on('message', function(message) {
        console.log(`Worker ${process.pid} receives message '${JSON.stringify(message)}'`);
    })

    console.log(`Worker ${process.pid} sends message to master....`);
    
    process.send({msg: `MESSAGE FROM WORKER ${process.pid}` });

    console.log(`Worker ${process.pid} finished`);

    // process.exit();
}

