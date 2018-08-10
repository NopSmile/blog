// init http server
var http = require('http');
var url = require('url');

var _initialSupply = 0;
var _tokenName = "";
var _decimalUnits = 18;
var _tokenSymbol = "";

let Web3 = require('web3');
let web3;

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var standardtokenContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_initialSupply","type":"uint256"},{"name":"_tokenName","type":"string"},{"name":"_decimalUnits","type":"uint8"},{"name":"_tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]);

var standardtokenABI = '0x608060405234801561001057600080fd5b50604051610bca380380610bca8339810160409081528151602080840151838501516060860151336000908152600585529586208590556003859055918601805194969095919492019261006792908601906100ab565b50805161007b9060019060208401906100ab565b50506002805460ff90921660ff19909216919091179055505060048054600160a060020a03191633179055610146565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100ec57805160ff1916838001178555610119565b82800160010185558215610119579182015b828111156101195782518255916020019190600101906100fe565b50610125929150610129565b5090565b61014391905b80821115610125576000815560010161012f565b90565b610a75806101556000396000f3006080604052600436106100b95763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100be578063095ea7b31461014857806318160ddd1461018057806323b872dd146101a7578063313ce567146101d157806366188463146101fc57806370a08231146102205780638da5cb5b1461024157806395d89b4114610272578063a9059cbb14610287578063d73dd623146102ab578063dd62ed3e146102cf575b600080fd5b3480156100ca57600080fd5b506100d36102f6565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561010d5781810151838201526020016100f5565b50505050905090810190601f16801561013a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561015457600080fd5b5061016c600160a060020a0360043516602435610384565b604080519115158252519081900360200190f35b34801561018c57600080fd5b506101956103ea565b60408051918252519081900360200190f35b3480156101b357600080fd5b5061016c600160a060020a03600435811690602435166044356103f0565b3480156101dd57600080fd5b506101e661066d565b6040805160ff9092168252519081900360200190f35b34801561020857600080fd5b5061016c600160a060020a0360043516602435610676565b34801561022c57600080fd5b50610195600160a060020a0360043516610765565b34801561024d57600080fd5b50610256610780565b60408051600160a060020a039092168252519081900360200190f35b34801561027e57600080fd5b506100d361078f565b34801561029357600080fd5b5061016c600160a060020a03600435166024356107e9565b3480156102b757600080fd5b5061016c600160a060020a0360043516602435610960565b3480156102db57600080fd5b50610195600160a060020a03600435811690602435166109f9565b6000805460408051602060026001851615610100026000190190941693909304601f8101849004840282018401909252818152929183018282801561037c5780601f106103515761010080835404028352916020019161037c565b820191906000526020600020905b81548152906001019060200180831161035f57829003601f168201915b505050505081565b336000818152600660209081526040808320600160a060020a038716808552908352818420869055815186815291519394909390927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925928290030190a350600192915050565b60035490565b600160a060020a038316600090815260056020526040812054821115610460576040805160e560020a62461bcd02815260206004820152601f60248201527f66726f6d27732062616c616e636520697320756e73756666696369656e742e00604482015290519081900360640190fd5b600160a060020a0384166000908152600660209081526040808320338452909152902054821115610500576040805160e560020a62461bcd028152602060048201526024808201527f76616c756520746f206265207472616e73666572656420697320756e6170707260448201527f6f76656400000000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b600160a060020a0383161515610560576040805160e560020a62461bcd02815260206004820152601760248201527f746f2773206164647265737320697320696e76616c6964000000000000000000604482015290519081900360640190fd5b600160a060020a038416600090815260056020526040902054610589908363ffffffff610a2416565b600160a060020a0380861660009081526005602052604080822093909355908516815220546105be908363ffffffff610a3616565b600160a060020a038085166000908152600560209081526040808320949094559187168152600682528281203382529091522054610602908363ffffffff610a2416565b600160a060020a03808616600081815260066020908152604080832033845282529182902094909455805186815290519287169391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a35060019392505050565b60025460ff1681565b336000908152600660209081526040808320600160a060020a03861684529091528120548083106106ca57336000908152600660209081526040808320600160a060020a03881684529091528120556106ff565b6106da818463ffffffff610a2416565b336000908152600660209081526040808320600160a060020a03891684529091529020555b336000818152600660209081526040808320600160a060020a0389168085529083529281902054815190815290519293927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929181900390910190a35060019392505050565b600160a060020a031660009081526005602052604090205490565b600454600160a060020a031681565b60018054604080516020600284861615610100026000190190941693909304601f8101849004840282018401909252818152929183018282801561037c5780601f106103515761010080835404028352916020019161037c565b33600090815260056020526040812054821115610850576040805160e560020a62461bcd02815260206004820152601860248201527f62616c616e636520697320756e73756666696369656e742e0000000000000000604482015290519081900360640190fd5b600160a060020a03831615156108b0576040805160e560020a62461bcd02815260206004820152601a60248201527f746172676574206164647265737320697320696e76616c69642e000000000000604482015290519081900360640190fd5b336000908152600560205260409020546108d0908363ffffffff610a2416565b3360009081526005602052604080822092909255600160a060020a03851681522054610902908363ffffffff610a3616565b600160a060020a0384166000818152600560209081526040918290209390935580518581529051919233927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a350600192915050565b336000908152600660209081526040808320600160a060020a0386168452909152812054610994908363ffffffff610a3616565b336000818152600660209081526040808320600160a060020a0389168085529083529281902085905580519485525191937f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929081900390910190a350600192915050565b600160a060020a03918216600090815260066020908152604080832093909416825291909152205490565b600082821115610a3057fe5b50900390565b81810182811015610a4357fe5b929150505600a165627a7a723058206cb3f3c3ad6606c63a33018a09e2fda800ac506cc90340b9f23dec2e9b2048660029';

http.createServer(function(req, res) {
	var postData = '';
	req.setEncoding('utf-8');
	req.addListener("data", function (postDataChunk) {
		postData += postDataChunk;
	});
	req.addListener("end", function () {
		var params;
		try {
			params = JSON.parse(postData);
		} catch(e) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			var body = '{"error": -1, "errMsg": "failed to parse request data."';
			res.write(body);
			res.end();

			console.log("url: ", req.url, ", method: ", req.method, 
				", params: ", params);

			return;
		}

		var initialSupply = params.initialSupply;
		var tokenName = params.tokenName;
		var decimalUnits = params.decimalUnits;
		var tokenSymbol = params.tokenSymbol;

		if (typeof initialSupply === 'undefined' ||
			typeof tokenName === 'undefined' ||
			typeof decimalUnits === 'undefined' ||
			typeof tokenSymbol === 'undefined') {
			res.writeHead(200, {'Content-Type': 'application/json'});
			var body = '{"error": -2, "errMsg": "failed to validate params."';
			res.write(body);
			res.end();

			console.log("initialSupply: ", initialSupply, ", ",
				"tokenName: ", tokenName, ", ",
				"decimalUnits: ", decimalUnits, ", ",
				"tokenSymbol: ", tokenSymbol);

			return;
		}

		console.log("+++ initialSupply: ", initialSupply, ", ",
			"tokenName: ", tokenName, ", ",
			"decimalUnits: ", decimalUnits, ", ",
			"tokenSymbol: ", tokenSymbol);


		var standardtoken = standardtokenContract.new(
			initialSupply, 
			tokenName, 
			decimalUnits, 
			tokenSymbol,
			{
				from: web3.eth.accounts[0], 
				data: standardtokenABI, 
				gas: '4700000'
			}, 
			function (e, contract) {
				//console.log(e, contract);
				if (typeof contract.address !== 'undefined') {
					console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
					res.writeHead(200, {'Content-Type': 'application/json'});
					var body = '{"erro": 0, "address": "' + contract.address + '", "hash": "' + contract.transactionHash + '"}';
					res.write(body);
					res.end();
				}
			}
		);
	});

}).listen(12306); // the server object listens on port 12306