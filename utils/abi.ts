export const contractAbiErc20 = [ {
    "name": "transfer",
    "type": "function",
    "inputs": [
        {
            "name": "_to",
            "type": "address"
        },
        {
            "type": "uint256",
            "name": "_tokens"
        }
    ],
    "constant": false,
    "outputs": [],
    "payable": false
}, {
    "constant": true,
    "inputs": [
        {
            "name": "_owner",
            "type": "address"
        }
    ],
    "name": "balanceOf",
    "outputs": [
        {
            "name": "balance",
            "type": "uint256"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
} ]