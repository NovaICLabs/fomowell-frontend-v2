export const idlFactory = ({ IDL }: { IDL: any }) => {
	const Value = IDL.Rec();
	const Account = IDL.Record({
		owner: IDL.Principal,
		subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
	});
	const StableToken = IDL.Record({
		fee: IDL.Nat,
		decimals: IDL.Nat8,
		name: IDL.Text,
		canister_id: IDL.Principal,
		symbol: IDL.Text,
	});
	const BuyArgs = IDL.Record({
		buy_min_token: IDL.Nat,
		boning_curve_id: IDL.Nat64,
		subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
		ckbtc_amount: IDL.Nat,
	});
	const Result = IDL.Variant({ Ok: IDL.Nat, Err: IDL.Text });
	const CreateMemeTokenArg = IDL.Record({
		creator: IDL.Opt(IDL.Principal),
		ticker: IDL.Text,
		twitter: IDL.Opt(IDL.Text),
		logo: IDL.Text,
		name: IDL.Text,
		description: IDL.Text,
		website: IDL.Opt(IDL.Text),
		telegram: IDL.Opt(IDL.Text),
	});
	const MemeToken = IDL.Record({
		id: IDL.Nat64,
		creator: IDL.Text,
		ticker: IDL.Text,
		available_token: IDL.Nat,
		twitter: IDL.Opt(IDL.Text),
		logo: IDL.Text,
		name: IDL.Text,
		completed: IDL.Bool,
		description: IDL.Text,
		created_at: IDL.Nat64,
		website: IDL.Opt(IDL.Text),
		ledger_canister: IDL.Opt(IDL.Text),
		market_cap_icp: IDL.Nat,
		telegram: IDL.Opt(IDL.Text),
	});
	const Result_1 = IDL.Variant({ Ok: MemeToken, Err: IDL.Text });
	const DepositArgs = IDL.Record({
		token: StableToken,
		memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
		subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
		amount: IDL.Nat,
	});
	const StatusRequest = IDL.Record({
		memory_size: IDL.Bool,
		cycles: IDL.Bool,
		heap_memory_size: IDL.Bool,
	});
	const MetricsGranularity = IDL.Variant({
		hourly: IDL.Null,
		daily: IDL.Null,
	});
	const GetMetricsParameters = IDL.Record({
		dateToMillis: IDL.Nat,
		granularity: MetricsGranularity,
		dateFromMillis: IDL.Nat,
	});
	const MetricsRequest = IDL.Record({ parameters: GetMetricsParameters });
	const GetLogMessagesFilter = IDL.Record({
		analyzeCount: IDL.Nat32,
		messageRegex: IDL.Opt(IDL.Text),
		messageContains: IDL.Opt(IDL.Text),
	});
	const GetLogMessagesParameters = IDL.Record({
		count: IDL.Nat32,
		filter: IDL.Opt(GetLogMessagesFilter),
		fromTimeNanos: IDL.Opt(IDL.Nat64),
	});
	const GetLatestLogMessagesParameters = IDL.Record({
		upToTimeNanos: IDL.Opt(IDL.Nat64),
		count: IDL.Nat32,
		filter: IDL.Opt(GetLogMessagesFilter),
	});
	const CanisterLogRequest = IDL.Variant({
		getMessagesInfo: IDL.Null,
		getMessages: GetLogMessagesParameters,
		getLatestMessages: GetLatestLogMessagesParameters,
	});
	const GetInformationRequest = IDL.Record({
		status: IDL.Opt(StatusRequest),
		metrics: IDL.Opt(MetricsRequest),
		logs: IDL.Opt(CanisterLogRequest),
		version: IDL.Bool,
	});
	const StatusResponse = IDL.Record({
		memory_size: IDL.Opt(IDL.Nat64),
		cycles: IDL.Opt(IDL.Nat64),
		heap_memory_size: IDL.Opt(IDL.Nat64),
	});
	const HourlyMetricsData = IDL.Record({
		updateCalls: IDL.Vec(IDL.Nat64),
		canisterHeapMemorySize: IDL.Vec(IDL.Nat64),
		canisterCycles: IDL.Vec(IDL.Nat64),
		canisterMemorySize: IDL.Vec(IDL.Nat64),
		timeMillis: IDL.Int,
	});
	const NumericEntity = IDL.Record({
		avg: IDL.Nat64,
		max: IDL.Nat64,
		min: IDL.Nat64,
		first: IDL.Nat64,
		last: IDL.Nat64,
	});
	const DailyMetricsData = IDL.Record({
		updateCalls: IDL.Nat64,
		canisterHeapMemorySize: NumericEntity,
		canisterCycles: NumericEntity,
		canisterMemorySize: NumericEntity,
		timeMillis: IDL.Int,
	});
	const CanisterMetricsData = IDL.Variant({
		hourly: IDL.Vec(HourlyMetricsData),
		daily: IDL.Vec(DailyMetricsData),
	});
	const CanisterMetrics = IDL.Record({ data: CanisterMetricsData });
	const MetricsResponse = IDL.Record({ metrics: IDL.Opt(CanisterMetrics) });
	const CanisterLogFeature = IDL.Variant({
		filterMessageByContains: IDL.Null,
		filterMessageByRegex: IDL.Null,
	});
	const CanisterLogMessagesInfo = IDL.Record({
		features: IDL.Vec(IDL.Opt(CanisterLogFeature)),
		lastTimeNanos: IDL.Opt(IDL.Nat64),
		count: IDL.Nat32,
		firstTimeNanos: IDL.Opt(IDL.Nat64),
	});
	const LogMessageData = IDL.Record({
		timeNanos: IDL.Nat64,
		message: IDL.Text,
	});
	const CanisterLogMessages = IDL.Record({
		data: IDL.Vec(LogMessageData),
		lastAnalyzedMessageTimeNanos: IDL.Opt(IDL.Nat64),
	});
	const CanisterLogResponse = IDL.Variant({
		messagesInfo: CanisterLogMessagesInfo,
		messages: CanisterLogMessages,
	});
	const GetInformationResponse = IDL.Record({
		status: IDL.Opt(StatusResponse),
		metrics: IDL.Opt(MetricsResponse),
		logs: IDL.Opt(CanisterLogResponse),
		version: IDL.Opt(IDL.Nat),
	});
	const GetBlocksRequest = IDL.Record({
		start: IDL.Nat,
		length: IDL.Nat,
	});
	const Buy = IDL.Record({
		token: IDL.Principal,
		from: Account,
		reserve0: IDL.Nat,
		reserve1: IDL.Nat,
		amount_out: IDL.Nat,
		amount_in: IDL.Nat,
		meme_token_id: IDL.Nat64,
	});
	const Deposit = IDL.Record({
		to: Account,
		height: IDL.Nat,
		token: IDL.Principal,
		memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
		amount: IDL.Nat,
		spender: Account,
	});
	Value.fill(
		IDL.Variant({
			Int: IDL.Int,
			Map: IDL.Vec(IDL.Tuple(IDL.Text, Value)),
			Nat: IDL.Nat,
			Nat64: IDL.Nat64,
			Blob: IDL.Vec(IDL.Nat8),
			Text: IDL.Text,
			Array: IDL.Vec(Value),
		})
	);
	const Mint = IDL.Record({
		metadata: IDL.Vec(IDL.Tuple(IDL.Text, Value)),
		from: Account,
		meme_token_id: IDL.Nat64,
		amount: IDL.Nat,
	});
	const Swap = IDL.Record({
		from: Account,
		reserve0: IDL.Nat,
		reserve1: IDL.Nat,
		amount0: IDL.Nat,
		amount1: IDL.Nat,
		token0: IDL.Principal,
		token1: IDL.Principal,
	});
	const LedgerType = IDL.Variant({
		MemeToken: IDL.Nat64,
		ICRCToken: IDL.Principal,
	});
	const Transfer = IDL.Record({
		to: Account,
		from: Account,
		memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
		ledger: LedgerType,
		amount: IDL.Nat,
	});
	const Transaction = IDL.Record({
		buy: IDL.Opt(Buy),
		withdraw: IDL.Opt(Deposit),
		kind: IDL.Text,
		mint: IDL.Opt(Mint),
		sell: IDL.Opt(Buy),
		swap: IDL.Opt(Swap),
		deposit: IDL.Opt(Deposit),
		timestamp: IDL.Nat64,
		transfer: IDL.Opt(Transfer),
	});
	const Burn = IDL.Record({
		from: Account,
		memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
		created_at_time: IDL.Opt(IDL.Nat64),
		amount: IDL.Nat,
		spender: IDL.Opt(Account),
	});
	const Mint_1 = IDL.Record({
		to: Account,
		memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
		created_at_time: IDL.Opt(IDL.Nat64),
		amount: IDL.Nat,
	});
	const Approve = IDL.Record({
		fee: IDL.Opt(IDL.Nat),
		from: Account,
		memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
		created_at_time: IDL.Opt(IDL.Nat64),
		amount: IDL.Nat,
		expected_allowance: IDL.Opt(IDL.Nat),
		expires_at: IDL.Opt(IDL.Nat64),
		spender: Account,
	});
	const Transfer_1 = IDL.Record({
		to: Account,
		fee: IDL.Opt(IDL.Nat),
		from: Account,
		memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
		created_at_time: IDL.Opt(IDL.Nat64),
		amount: IDL.Nat,
		spender: IDL.Opt(Account),
	});
	const Transaction_1 = IDL.Record({
		burn: IDL.Opt(Burn),
		kind: IDL.Text,
		mint: IDL.Opt(Mint_1),
		approve: IDL.Opt(Approve),
		timestamp: IDL.Nat64,
		transfer: IDL.Opt(Transfer_1),
	});
	const TransactionRange = IDL.Record({
		transactions: IDL.Vec(Transaction_1),
	});
	const ArchivedRange = IDL.Record({
		callback: IDL.Func([GetBlocksRequest], [TransactionRange], ["query"]),
		start: IDL.Nat,
		length: IDL.Nat,
	});
	const GetTransactionsResponse = IDL.Record({
		first_index: IDL.Nat,
		log_length: IDL.Nat,
		transactions: IDL.Vec(Transaction),
		archived_transactions: IDL.Vec(ArchivedRange),
	});
	const SellArgs = IDL.Record({
		token_amount: IDL.Nat,
		boning_curve_id: IDL.Nat64,
		subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
		btc_min_amount: IDL.Nat,
	});
	const WithdrawArgs = IDL.Record({
		to: Account,
		token: StableToken,
		memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
		subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
		amount: IDL.Nat,
	});
	return IDL.Service({
		__get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ["query"]),
		buy: IDL.Func([BuyArgs], [Result], []),
		calculate_buy: IDL.Func([IDL.Nat64, IDL.Nat], [Result], ["query"]),
		calculate_sell: IDL.Func([IDL.Nat64, IDL.Nat], [Result], ["query"]),
		create_token: IDL.Func([CreateMemeTokenArg], [Result_1], []),
		deposit: IDL.Func([DepositArgs], [Result], []),
		getCanistergeekInformation: IDL.Func(
			[GetInformationRequest],
			[GetInformationResponse],
			["query"]
		),
		get_transactions: IDL.Func(
			[GetBlocksRequest],
			[GetTransactionsResponse],
			["query"]
		),
		icrc1_balance_of: IDL.Func([IDL.Principal, Account], [IDL.Nat], ["query"]),
		query_meme_token: IDL.Func([IDL.Nat64], [IDL.Opt(MemeToken)], ["query"]),
		sell: IDL.Func([SellArgs], [Result], []),
		withdraw: IDL.Func([WithdrawArgs], [Result], []),
	});
};
export const init = ({ IDL }: { IDL: any }) => {
	const Account = IDL.Record({
		owner: IDL.Principal,
		subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
	});
	const StableToken = IDL.Record({
		fee: IDL.Nat,
		decimals: IDL.Nat8,
		name: IDL.Text,
		canister_id: IDL.Principal,
		symbol: IDL.Text,
	});
	const InitArg = IDL.Record({
		icp_launch_thread_hold: IDL.Nat,
		fee_receiver: Account,
		create_token_fee: IDL.Opt(IDL.Nat64),
		maintenance: IDL.Bool,
		fee_percentage: IDL.Opt(IDL.Float32),
		icp_canister: StableToken,
	});
	return [InitArg];
};
