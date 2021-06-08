const {Gateway, Wallets, DefaultEventHandlerStrategies} = require('fabric-network');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const channelName = "mychannel"
const contractName = "kvstore"
const org1UserId = "appUser"


async function getContract() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            process.exit(1);
        }


        const gateway = new Gateway();
        await gateway.connect(ccp,
            {
            wallet, identity: 'appUser',
            discovery: { enabled: true, asLocalhost: true}
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(contractName);
        console.log(`Contract ${contractName} on Channel ${channelName} has been setup... }`);
        return contract;

    } catch (error) {
        console.error(`Failed to set up the contract and channel: ${error}`);
        process.exit(1);
    }
}


async function set(contract,key,value) {
    try {
          const result = await contract.submitTransaction('Write', key, value);
          console.log(result.toString())
    }catch (error){
            console.log(error)
        return 0
    }


}

module.exports = {set, getContract}
