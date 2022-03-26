const GoodChain = require( "../main.js" );
const path = require( "path" );
const fs = require( "fs" );
const { inspect } = require( "util" );



( async () =>
{
	const scriptPath = path.dirname( process.argv[1] );

	const savedState = require( "./my_chain/mystate.json" );
	const savedChain = require( "./my_chain/mychain.json" );
	const savedNodes = require( "./my_chain/mynodes.json" );

	const userKeysPath = path.join( scriptPath, "./my_keys/" );
	const userPublicKey = fs.readFileSync( path.join( userKeysPath, "public_key.pem" ), "utf8" );
	const userPrivateKey = fs.readFileSync( path.join( userKeysPath, "private_key.pem" ), "utf8" );

	const validatorKeyPath = path.join( scriptPath, "./validator_keys/" );
	const validatorPublicKey = fs.readFileSync( path.join( validatorKeyPath, "public_key.pem" ), "utf8" );
	const validatorPrivateKey = fs.readFileSync( path.join( validatorKeyPath, "private_key.pem" ), "utf8" );
	const validator = {
		publicKey: validatorPublicKey,
		privateKey: validatorPrivateKey
	};

	// GoodChain.generateKeyPairs(__dirname);
	// const chain = await new GoodChain();
	const chain = await new GoodChain( { validator } );
	// console.log(chain.chain);
	// from and to can be in HEX or PEM format
	const new_transaction = {
		index: 1, // userPublicKey N transaction
		from: userPublicKey,
		to: validatorPublicKey, // it is null for programs
		amount: 1,
		fee: 1,
		tickPrice: 0,
	};
	new_transaction.sign = chain.signTransaction( new_transaction, userPrivateKey ); // sign the transaction by the private key of the sender
	// signature must be unique in the chain or it is hacker attempt to broadcast someone else's old transaction again
	new_transaction.hash = chain.hash( new_transaction );
	await chain.new_transaction( new_transaction );
	await chain.new_block();
	// console.log(chain.chain);
	console.log( inspect( chain.chain, { colors: true, depth: null } ) );
	// console.log(process.cwd() , process.argv[1], __dirname );
	// const chain = await new GoodChain({ chain: savedChain, state: savedState, nodes: savedNodes });
	// const block = await chain.new_block("0x1234567890123456789012345678901234567890");
} )();