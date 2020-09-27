const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length - 14;


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

// function masterProcess(){
//     console.log(`Master ${process.pid} is running`);

//     for(let i = 0; i < numCPUs; i++){
//         console.log(`Forking process number ${i}...`);
//         cluster.fork();
//     }
    
//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`Worker ${worker.process.pid} died`);
//         console.log(`Forking a new process...`);
    
//         cluster.fork();
//     });
      
    
//     // process.exit();
// }

/* When a child process is created and executed, it does the same as the master, 
 *  that is, imports the cluster module and executes the if statement. 
 *  Once of the differences is for the child process the value of cluster.isMaster is false, 
 *  so they ends running the childProcess function. 
*/

/**
 *  In any OS a process can use a port to communicate with other systems and, 
 *  that means, the given port can only be used by that process. 
 *  So, the question is, how can the forked worker processes use the same port?

    The answer, the simplified answer, is the master process is the one who listens in the given port and 
    load balances the requests among all the child/worker processes. 
 */

/**
 * As long as there are some workers still alive, the server will continue to accept connections. If no workers are alive, existing connections will be dropped and new connections will be refused.
 */

function childProcess(){

    console.log(`Worker ${process.pid} started`);
    
    http.createServer((req, res) => {
        console.log("req received:")
        res.writeHead(200);
        res.end(` Hello World from worker ${process.pid}`)
        // process.exit(1);
    }).listen(3000)

    console.log(`Worker ${process.pid} finished`);
}

