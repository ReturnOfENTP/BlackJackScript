const { exec } = require('child_process');

// Function to generate new deposit address
const createNewDepositAddress = () => {
  return new Promise((resolve, reject) => {
    exec('/Applications/Electrum.app/Contents/MacOS/run_electrum createnewaddress', (err, stdout, stderr) => {
      if (err) {
        reject(`Error generating address: ${err}`);
      } else {
        resolve(stdout.trim()); // Address is returned in stdout
      }
    });
  });
};

module.exports = { createNewDepositAddress };