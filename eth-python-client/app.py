import time

from flask import Flask, request, jsonify
import json
import logging
from ethereum import Ethereum

app = Flask(__name__)

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
eth_net = None


@app.route("/invoke", methods=['POST'])
def invoke():
    start = time.time()
    data = json.loads(request.get_data())
    key = data["args"][0]
    value = data["args"][1]
    # setFunction(key, value)
    res = eth_net.setFunction(key, value)
    end = time.time()
    return jsonify({"receipt": res, "latency_ms": end - start})


if __name__ == '__main__':
    url = "http://3.138.182.146:8545"
    abi = [
        {
            "constant": False,
            "inputs": [
                {
                    "name": "key",
                    "type": "string"
                },
                {
                    "name": "value",
                    "type": "string"
                }
            ],
            "name": "set",
            "outputs": [],
            "payable": False,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": True,
            "inputs": [
                {
                    "name": "key",
                    "type": "string"
                }
            ],
            "name": "get",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": False,
            "stateMutability": "view",
            "type": "function"
        }
    ]
    address = "0x34afe602f642aedd6322bbd68a9300845b31c27b"
    account = "0xa7efd857de41dc223cfc8cf6fe052348492864c4"
    if eth_net is None:
        eth_net = Ethereum(url, abi, address, account)
    app.run(host='0.0.0.0', debug=True, port=3000)
