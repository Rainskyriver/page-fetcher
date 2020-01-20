const args = process.argv.slice(2);
const readline = require('readline');
const fs = require('fs');
const http = require('http');
const request = require('request');





//use request library
//node f's module
//callback based approach
// !pipe() && !synchronous()

const downloadConfirmation = function(size, filePath) {
  process.stdout.write(`Downloaded and saved ${size}mb to ${filePath}\n`);
}

const fetcher = function(printFunction) {
  const domain = args[0];
  const filePath = args[1];

  request(domain, 'utf8', (error, response, body) => {
    if (error) {
      console.log(new Error('The url you have entered is invalid.'));
      return 0;
    }
    fs.writeFile(filePath, body, 'utf8', (error) => {
      if (error) {
        console.log(`There has been an error: ${error}`);
        return 0;
      }
      fs.stat(filePath, (error, stats) => {
        if (error) {
          console.log(`There has been an error: ${error}`)
          return 0;
        }
        printFunction(stats.size, filePath)
      });     
    });
  });
}

const askForOverwrite = function(doWithPermission) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const filePath = args[1];
    fs.access(filePath, fs.constants.F_OK, (error) => {
      if (!(error)) {
        rl.question('This file already exists, do you want to overwrite it? Y/N\n', (answer) => {
          if (answer === 'Y' || answer === "y") {
            doWithPermission(downloadConfirmation);
            rl.close();
          } else if (answer === 'N' || answer === 'n') {
            rl.close();
          }
        });
      } else {
        doWithPermission(downloadConfirmation);
        rl.close();
      }
    });
};

askForOverwrite(fetcher);
