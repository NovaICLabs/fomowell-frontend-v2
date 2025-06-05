export const idlFactory = ({ IDL }: { IDL: any }) => {
	// const BitcoinNetwork = IDL.Variant({
	// 	mainnet: IDL.Null,
	// 	regtest: IDL.Null,
	// 	testnet: IDL.Null,
	// });
	// const InitArgs = IDL.Record({
	// 	runes_indexer: IDL.Principal,
	// 	network: BitcoinNetwork,
	// 	ckbtc_minter: IDL.Principal,
	// 	ckbtc_ledger: IDL.Principal,
	// 	timer_for_reveal_txn: IDL.Nat32,
	// });
	const Result = IDL.Variant({ Ok: IDL.Null, Err: IDL.Text });
	const StatusRequest = IDL.Record({
		memory_size: IDL.Bool,
		cycles: IDL.Bool,
		heap_memory_size: IDL.Bool,
	});
	const StatusResponse = IDL.Record({
		memory_size: IDL.Opt(IDL.Nat64),
		cycles: IDL.Opt(IDL.Nat64),
		heap_memory_size: IDL.Opt(IDL.Nat64),
	});
	const EtchingArgs = IDL.Record({
		cap: IDL.Nat,
		height: IDL.Opt(IDL.Tuple(IDL.Nat64, IDL.Nat64)),
		turbo: IDL.Bool,
		premine: IDL.Nat,
		rune: IDL.Text,
		divisibility: IDL.Nat8,
		offset: IDL.Opt(IDL.Tuple(IDL.Nat64, IDL.Nat64)),
		fee_rate: IDL.Opt(IDL.Nat64),
		amount: IDL.Nat,
		symbol: IDL.Nat32,
	});
	const Account = IDL.Record({
		owner: IDL.Principal,
		subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
	});
	const Addresses = IDL.Record({
		icrc1_string: IDL.Text,
		account_identifier: IDL.Vec(IDL.Nat8),
		icrc1: Account,
		ckbtc_mint: IDL.Text,
		bitcoin: IDL.Text,
		account_identifier_string: IDL.Text,
	});
	const Result_1 = IDL.Variant({ Ok: IDL.Text, Err: IDL.Text });
	const Terms = IDL.Record({
		cap: IDL.Opt(IDL.Nat),
		height: IDL.Tuple(IDL.Opt(IDL.Nat64), IDL.Opt(IDL.Nat64)),
		offset: IDL.Tuple(IDL.Opt(IDL.Nat64), IDL.Opt(IDL.Nat64)),
		amount: IDL.Opt(IDL.Nat),
	});
	const RuneInfo = IDL.Record({
		id: IDL.Nat64,
		confirmations: IDL.Nat32,
		mints: IDL.Nat,
		terms: IDL.Opt(Terms),
		etching: IDL.Text,
		turbo: IDL.Bool,
		premine: IDL.Nat,
		rune_utxo_vout: IDL.Nat32,
		rune_utxo: IDL.Opt(IDL.Text),
		divisibility: IDL.Nat8,
		rune_balance: IDL.Nat,
		spaced_rune: IDL.Text,
		number: IDL.Nat64,
		timestamp: IDL.Nat64,
		block: IDL.Nat64,
		burned: IDL.Nat,
		rune_id: IDL.Text,
		mint_address: IDL.Text,
		symbol: IDL.Opt(IDL.Text),
	});
	const PagedResponse = IDL.Record({
		total: IDL.Nat64,
		offset: IDL.Nat64,
		limit: IDL.Nat64,
		items: IDL.Vec(RuneInfo),
	});
	const RuneId = IDL.Record({ tx: IDL.Nat32, block: IDL.Nat64 });
	const TokenType = IDL.Variant({ Rune: RuneId, Bitcoin: IDL.Null });
	const Outpoint = IDL.Record({
		txid: IDL.Vec(IDL.Nat8),
		vout: IDL.Nat32,
	});
	const Utxo = IDL.Record({
		height: IDL.Nat32,
		value: IDL.Nat64,
		outpoint: Outpoint,
	});
	const MintAddress = IDL.Record({
		mint_btc_address: IDL.Text,
		platform_icrc1_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
		index: IDL.Nat64,
		mint_icrc1_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
	});
	const RunicUtxo = IDL.Record({ balance: IDL.Nat, utxo: Utxo });
	const UtxoStatus = IDL.Variant({
		ValueTooSmall: Utxo,
		Tainted: Utxo,
		Minted: IDL.Record({
			minted_amount: IDL.Nat64,
			block_index: IDL.Nat64,
			utxo: Utxo,
		}),
		Checked: Utxo,
	});
	const RuneEntry = IDL.Record({
		confirmations: IDL.Nat32,
		mints: IDL.Nat,
		terms: IDL.Opt(Terms),
		etching: IDL.Text,
		turbo: IDL.Bool,
		premine: IDL.Nat,
		divisibility: IDL.Nat8,
		spaced_rune: IDL.Text,
		number: IDL.Nat64,
		timestamp: IDL.Nat64,
		block: IDL.Nat64,
		burned: IDL.Nat,
		rune_id: IDL.Text,
		symbol: IDL.Opt(IDL.Text),
	});
	const WalletReceiveResult = IDL.Record({ accepted: IDL.Nat64 });
	const WithdrawalType = IDL.Variant({
		Rune: IDL.Record({
			to: IDL.Text,
			fee_per_vbytes: IDL.Opt(IDL.Nat64),
			runeid: RuneId,
			amount: IDL.Nat,
		}),
		Bitcoin: IDL.Record({
			to: IDL.Text,
			fee_per_vbytes: IDL.Opt(IDL.Nat64),
			amount: IDL.Nat64,
		}),
	});
	const SubmittedTxidType = IDL.Variant({
		Bitcoin: IDL.Record({ txid: IDL.Text }),
	});
	return IDL.Service({
		__get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ["query"]),
		add_used_tx_id: IDL.Func([IDL.Text, IDL.Nat64], [Result], []),
		canister_get_status: IDL.Func([StatusRequest], [StatusResponse], ["query"]),
		confirm_and_convert_ckbtc: IDL.Func([], [IDL.Nat64], []),
		etch_rune: IDL.Func([EtchingArgs], [IDL.Text, IDL.Text], []),
		get_btc_balance: IDL.Func([], [IDL.Nat64], []),
		get_deposit_address_for_bitcoin: IDL.Func([], [IDL.Text], []),
		get_deposit_address_for_ckbtc: IDL.Func([], [IDL.Text], ["query"]),
		get_deposit_addresses: IDL.Func([], [Addresses], ["query"]),
		get_estimated_cbktc_conversion_fee: IDL.Func(
			[],
			[IDL.Nat64],
			["composite_query"]
		),
		get_fast_btc_address: IDL.Func(
			[IDL.Opt(IDL.Vec(IDL.Nat8))],
			[Result_1],
			[]
		),
		get_mint_rune_by_id: IDL.Func(
			[IDL.Nat64],
			[IDL.Opt(RuneInfo)],
			["composite_query"]
		),
		get_mint_rune_by_name: IDL.Func(
			[IDL.Text],
			[IDL.Opt(RuneInfo)],
			["composite_query"]
		),
		get_rune_list: IDL.Func(
			[IDL.Nat64, IDL.Nat64],
			[PagedResponse],
			["composite_query"]
		),
		get_user_balances: IDL.Func(
			[],
			[IDL.Vec(IDL.Tuple(TokenType, IDL.Nat))],
			[]
		),
		query_conversion_status: IDL.Func(
			[IDL.Nat64],
			[IDL.Text],
			["composite_query"]
		),
		query_user_bitcoin_utxos: IDL.Func([IDL.Text], [IDL.Vec(Utxo)], ["query"]),
		query_user_ckbtc_address_paginated: IDL.Func(
			[IDL.Nat64, IDL.Nat64],
			[
				IDL.Vec(IDL.Tuple(IDL.Principal, MintAddress)),
				IDL.Nat64,
				IDL.Opt(IDL.Nat64),
			],
			["query"]
		),
		query_user_runic_utxos: IDL.Func(
			[IDL.Text, RuneId],
			[IDL.Vec(RunicUtxo)],
			["query"]
		),
		record_user_runic_utxos: IDL.Func(
			[IDL.Text, RuneId, IDL.Vec(RunicUtxo)],
			[Result],
			[]
		),
		update_fast_btc_balance: IDL.Func([], [IDL.Vec(UtxoStatus)], []),
		update_rune_balance: IDL.Func(
			[IDL.Nat64, IDL.Text, IDL.Nat32, IDL.Nat],
			[Result],
			[]
		),
		update_rune_from_indexer: IDL.Func([IDL.Text], [IDL.Opt(RuneEntry)], []),
		wallet_balance: IDL.Func([], [IDL.Nat], ["query"]),
		wallet_receive: IDL.Func([], [WalletReceiveResult], []),
		withdraw: IDL.Func([WithdrawalType], [SubmittedTxidType], []),
	});
};
export const init = ({ IDL }: { IDL: any }) => {
	const BitcoinNetwork = IDL.Variant({
		mainnet: IDL.Null,
		regtest: IDL.Null,
		testnet: IDL.Null,
	});
	const InitArgs = IDL.Record({
		runes_indexer: IDL.Principal,
		network: BitcoinNetwork,
		ckbtc_minter: IDL.Principal,
		ckbtc_ledger: IDL.Principal,
		timer_for_reveal_txn: IDL.Nat32,
	});
	return [InitArgs];
};
