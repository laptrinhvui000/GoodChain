const savedState = require("./mystate.json");
const savedChain = require("./mychain.json");
const savedNodes = require("./mynodes.json");
const GoodChain = require("../main.js");
const path = require ("path");
const fs = require ("fs");
const { inspect } = require("util");
const { dirname } = require("path");



(async () => 
{
	const userKeysPath = path.join(path.dirname(process.argv[1]), "./keys/");
	const userPublicKey = fs.readFileSync(path.join(userKeysPath, "public_key.pem"), "utf8");
	const userPrivateKey = fs.readFileSync(path.join(userKeysPath, "private_key.pem"), "utf8");

	const validatorPublicKey = fs.readFileSync("keys/public_key.pem", "utf8");
	const validatorPrivateKey = fs.readFileSync("keys/private_key.pem", "utf8");
	const validator = {
		publicKey: validatorPublicKey,
		privateKey: validatorPrivateKey
	};

	const chain = await new GoodChain({validator});
	// chain.generateKeyPairs(__dirname);
	// console.log(chain.chain);
	// from and to can be in HEX or PEM format
	const new_transaction = {
		index: 0, // userPublicKey N transaction 
		from: userPublicKey,
		to: validatorPublicKey, // it is null for programs
		amount: 1,
		fee: 1,
		tickPrice: 0,
	};
	new_transaction.sign = chain.signTransaction(new_transaction, userPrivateKey); // sign the transaction by the private key of the sender
	// signature must be unique in the chain or it is hacker attempt to broadcast someone else's old transaction again
	new_transaction.hash = chain.hash(new_transaction);
	await chain.new_transaction(new_transaction);
	await chain.new_block();
	// console.log(chain.chain);
	console.log(inspect(chain.chain, {colors: true, depth: null}));
	// console.log(process.cwd() , process.argv[1], __dirname );
	// const chain = await new GoodChain({ chain: savedChain, state: savedState, nodes: savedNodes });
	// const block = await chain.new_block("0x1234567890123456789012345678901234567890");
})();