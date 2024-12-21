const { exec } = require('child_process');

// Function to list incoming requests (deposits)
const listIncomingDeposits = () => {
  return new Promise((resolve, reject) => {
    exec('/Applications/Electrum.app/Contents/MacOS/run_electrum list_requests', (err, stdout, stderr) => {
      if (err) {
        reject(`Error listing deposits: ${err}`);
      } else {
        resolve(JSON.parse(stdout)); // Returns a list of requests in JSON format
      }
    });
  });
};

module.exports = { listIncomingDeposits };

// Function to get transaction details by txid
const getTransactionDetails = (txid) => {
    return new Promise((resolve, reject) => {
      exec(`/Applications/Electrum.app/Contents/MacOS/run_electrum gettransaction ${txid}`, (err, stdout, stderr) => {
        if (err) {
          reject(`Error fetching transaction: ${err}`);
        } else {
          resolve(JSON.parse(stdout)); // Returns the transaction details in JSON format
        }
      });
    });
  };
  
  module.exports = { getTransactionDetails };
  