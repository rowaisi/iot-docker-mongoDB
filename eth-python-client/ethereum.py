import time

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
        start = time.time()
        response = self.session.post(self.url, json=payload, headers=headers)
        receipt = response.json()['result']
        end = time.time() - start
        print("txnID: ", receipt, " latency_ms:", end)
        return receipt


