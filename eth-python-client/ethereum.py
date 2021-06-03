import requests
from web3 import Web3


class Ethereum:
    def __init__(self, url, abi, address, account):
        print("##init eth##")
        self.url = url
        self.abi = abi
        self.session = requests.Session()
        self.address = address
        self.account = account
        self.web3 = Web3(Web3.HTTPProvider(url))
        self.contract = self.web3.eth.contract(address=Web3.toChecksumAddress(address), abi=abi)

    def getContract(self):
        return self.contract

    def deployKVSTORE(self):
        method = 'eth_sendTransaction'
        params = [{"gas": "0x100000", "gasPrice": "0x0", "from": "0xa7efd857de41dc223cfc8cf6fe052348492864c4",
                   "data": "0x6060604052610398806100126000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063693ec85e14610047578063e942b5161461010e57610042565b610002565b34610002576100a06004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506101b0565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156101005780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34610002576101ae6004808035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506102aa565b005b6020604051908101604052806000815260200150600060005082604051808280519060200190808383829060006004602084601f0104600302600f01f15090500191505090815260200160405180910390206000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102995780601f1061026e57610100808354040283529160200191610299565b820191906000526020600020905b81548152906001019060200180831161027c57829003601f168201915b505050505090506102a5565b919050565b80600060005083604051808280519060200190808383829060006004602084601f0104600302600f01f15090500191505090815260200160405180910390206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061033557805160ff1916838001178555610366565b82800160010185558215610366579182015b82811115610365578251826000505591602001919060010190610347565b5b5090506103919190610373565b8082111561038d5760008181506000905550600101610373565b5090565b50505b505056"}]

        payload = {"jsonrpc": "2.0",
                   "method": method,
                   "params": params,
                   "id": 1}
        headers = {'Content-type': 'application/json'}

        response = self.session.post(self.url, json=payload, headers=headers)
        return response.json()['result']

    def get_sm_add(self, receipt):
        method = 'eth_getTransactionReceipt'
        params = [receipt]

        payload = {"jsonrpc": "2.0",
                   "method": method,
                   "params": params,
                   "id": 1}

        headers = {'Content-type': 'application/json'}

        response = self.session.post(self.url, json=payload, headers=headers)
        return response.json()['result']['contractAddress']

    def encodeABI(self, key, value):
        data = self.contract.encodeABI("set", args=[key, value])
        return data

    def setFunction(self, key, value):
        method = 'eth_sendTransaction'
        data = self.encodeABI(key, value)

        params = [{"gas": "0x100000",
                   "gasPrice": "0x0",
                   "from": self.account,
                   "to": self.address,
                   "data": data
                   }]

        payload = {"jsonrpc": "2.0",
                   "method": method,
                   "params": params,
                   "id": 1}

        headers = {'Content-type': 'application/json'}

        response = self.session.post(self.url, json=payload, headers=headers)
        print('TXID: {}'.format(response.json()['result']))
        return response.json()['result']
