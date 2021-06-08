const {Gateway, Wallets, DefaultEventHandlerStrategies} = require('fabric-network');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const channelName = "mychannel"
const chaincodeName = "kvstore"
const org1UserId = "appUser"


async function getContract() {
    const gateway = new Gateway();
    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get('appUser');
    if (!identity) {
        console.log('An identity for the user "appUser" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        process.exit(1);
    }

// Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    try {

        await gateway.connect(ccp,
            {
                wallet,
                identity: org1UserId,
                discovery: {enabled: true, asLocalhost: true},
            });

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(channelName);
        await new Promise(async (resolve, reject) => {
             // Get the contract from the network.
        const contract = network.getContract(chaincodeName);
        resolve(contract)
            console.log(`Contract ${chaincodeName} on Channel ${channelName} has been setup... }`);
        })
    } catch (error) {
        console.log(error);
    }
}


async function set(contract,key,value) {
    try {
          const result = await contract.submitTransaction('Write', key, value);
          console.log(result)
    }catch (error){
            console.log(error)
    }


}

module.exports = {set, getContract}
