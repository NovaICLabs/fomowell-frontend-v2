export const idlFactory = ({ IDL }: { IDL: any }) => {
	const BTreeMap = IDL.Rec();
	const Value = IDL.Rec();
	const Account = IDL.Record({
		owner: IDL.Principal,
		subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
	});
	const TokenAmount = IDL.Record({
		token: IDL.Principal,
		amount: IDL.Nat,
	});
	const InitArchiveArg = IDL.Record({
		maxRecordsToArchive: IDL.Nat,
		maxArchivePages: IDL.Nat,
		settleToRecords: IDL.Nat,
		archiveCycles: IDL.Nat,
		maxActiveRecords: IDL.Nat,
		maxRecordsInArchiveInstance: IDL.Nat,
		archiveControllers: IDL.Opt(IDL.Opt(IDL.Vec(IDL.Principal))),
	});
	const InitArg = IDL.Record({
		fee_receiver: Account,
		create_token_fee: IDL.Vec(TokenAmount),
		archive_init: IDL.Opt(InitArchiveArg),
		token_launch_threshold: IDL.Vec(TokenAmount),
		maintenance: IDL.Bool,
		fee_percentage: IDL.Opt(IDL.Float32),
	});
	const BuyArgs = IDL.Record({
		amount_out_min: IDL.Opt(IDL.Nat),
		memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
		subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
		amount_in: IDL.Nat,
		meme_token_id: IDL.Nat64,
	});
	const BuyResponse = IDL.Record({
		amount_out: IDL.Nat,
		is_completed: IDL.Bool,
	});
	const Result = IDL.Variant({ Ok: BuyResponse, Err: IDL.Text });
	const Result_1 = IDL.Variant({ Ok: IDL.Nat, Err: IDL.Text });
	const StableToken = IDL.Record({
		fee: IDL.Nat,
		decimals: IDL.Nat8,
		name: IDL.Text,
		canister_id: IDL.Principal,
		symbol: IDL.Text,
	});
	const ClaimArg = IDL.Record({
		token: StableToken,
		claimer: IDL.Opt(IDL.Principal),
	});
	const CreateMemeTokenArg = IDL.Record({
		creator: IDL.Opt(IDL.Principal),
		token: StableToken,
		ticker: IDL.Text,
		logo_base64: IDL.Text,
		twitter: IDL.Opt(IDL.Text),
		logo: IDL.Text,
		name: IDL.Text,
		description: IDL.Text,
		website: IDL.Opt(IDL.Text),
		dev_buy: IDL.Opt(IDL.Nat),
		telegram: IDL.Opt(IDL.Text),
	});
	const BondingCurve = IDL.Record({
		token: StableToken,
		token_reserve: IDL.Nat,
		meme_token_reserve: IDL.Nat,
		k_last: IDL.Nat,
		total_supply: IDL.Nat,
	});
	const MemeToken = IDL.Record({
		bc: BondingCurve,
		id: IDL.Nat64,
		creator: IDL.Text,
		ticker: IDL.Text,
		available_token: IDL.Nat,
		twitter: IDL.Opt(IDL.Text),
		logo: IDL.Text,
		name: IDL.Text,
		market_cap_token: IDL.Nat,
		completed: IDL.Bool,
		description: IDL.Text,
		lp_canister: IDL.Opt(IDL.Principal),
		created_at: IDL.Nat64,
		website: IDL.Opt(IDL.Text),
		ledger_canister: IDL.Opt(IDL.Principal),
		price: IDL.Float64,
		telegram: IDL.Opt(IDL.Text),
		process: IDL.Float64,
	});
	const Result_2 = IDL.Variant({ Ok: MemeToken, Err: IDL.Text });
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
	const TransactionRange = IDL.Record({
		start: IDL.Nat,
		length: IDL.Nat,
	});
	const Buy = IDL.Record({
		fee: IDL.Opt(IDL.Nat),
		token: IDL.Principal,
		from: Account,
		amount_out: IDL.Nat,
		reserve_out: IDL.Nat,
		amount_in: IDL.Nat,
		reserve_in: IDL.Nat,
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
	BTreeMap.fill(
		IDL.Vec(
			IDL.Tuple(
				IDL.Text,
				IDL.Variant({
					Int: IDL.Int,
					Map: BTreeMap,
					Nat: IDL.Nat,
					Nat64: IDL.Nat64,
					Blob: IDL.Vec(IDL.Nat8),
					Text: IDL.Text,
					Array: IDL.Vec(Value),
				})
			)
		)
	);
	Value.fill(
		IDL.Variant({
			Int: IDL.Int,
			Map: BTreeMap,
			Nat: IDL.Nat,
			Nat64: IDL.Nat64,
			Blob: IDL.Vec(IDL.Nat8),
			Text: IDL.Text,
			Array: IDL.Vec(Value),
		})
	);
	const Mint = IDL.Record({
		meme_token0: IDL.Nat64,
		metadata: IDL.Vec(IDL.Tuple(IDL.Text, Value)),
		from: Account,
		reserve0: IDL.Nat,
		reserve1: IDL.Nat,
		token1: IDL.Principal,
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
		index: IDL.Nat,
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
	const TransactionRange_1 = IDL.Record({
		transactions: IDL.Vec(Transaction_1),
	});
	const ArchivedRange = IDL.Record({
		callback: IDL.Func([TransactionRange], [TransactionRange_1], ["query"]),
		start: IDL.Nat,
		length: IDL.Nat,
	});
	const GetTransactionsResponse = IDL.Record({
		first_index: IDL.Nat,
		log_length: IDL.Nat,
		transactions: IDL.Vec(Transaction),
		archived_transactions: IDL.Vec(ArchivedRange),
	});
	const SupportedStandard = IDL.Record({ url: IDL.Text, name: IDL.Text });
	const ConsentMessageMetadata = IDL.Record({
		utc_offset_minutes: IDL.Opt(IDL.Int16),
		language: IDL.Text,
	});
	const DisplayMessageType = IDL.Variant({
		GenericDisplay: IDL.Null,
		LineDisplay: IDL.Record({
			characters_per_line: IDL.Nat16,
			lines_per_page: IDL.Nat16,
		}),
	});
	const ConsentMessageSpec = IDL.Record({
		metadata: ConsentMessageMetadata,
		device_spec: IDL.Opt(DisplayMessageType),
	});
	const ConsentMessageRequest = IDL.Record({
		arg: IDL.Vec(IDL.Nat8),
		method: IDL.Text,
		user_preferences: ConsentMessageSpec,
	});
	const LineDisplayPage = IDL.Record({ lines: IDL.Vec(IDL.Text) });
	const ConsentMessage = IDL.Variant({
		LineDisplayMessage: IDL.Record({ pages: IDL.Vec(LineDisplayPage) }),
		GenericDisplayMessage: IDL.Text,
	});
	const ConsentInfo = IDL.Record({
		metadata: ConsentMessageMetadata,
		consent_message: ConsentMessage,
	});
	const ErrorInfo = IDL.Record({ description: IDL.Text });
	const Icrc21Error = IDL.Variant({
		GenericError: IDL.Record({
			description: IDL.Text,
			error_code: IDL.Nat,
		}),
		InsufficientPayment: ErrorInfo,
		UnsupportedCanisterCall: ErrorInfo,
		ConsentMessageUnavailable: ErrorInfo,
	});
	const Result_3 = IDL.Variant({ Ok: ConsentInfo, Err: Icrc21Error });
	const Icrc28TrustedOrigins = IDL.Record({
		trusted_origins: IDL.Vec(IDL.Text),
	});
	const Sort = IDL.Variant({
		CreateTimeDsc: IDL.Null,
		MarketCapDsc: IDL.Null,
	});
	const QueryMemeTokenArgs = IDL.Record({
		sort: IDL.Opt(Sort),
		start: IDL.Nat64,
		length: IDL.Nat64,
	});
	const QueryMemeTokenResponse = IDL.Record({
		meme_tokens: IDL.Vec(MemeToken),
		count: IDL.Nat64,
	});
	const ArchiveSetting = IDL.Record({
		max_records_in_archive_instance: IDL.Nat,
		archive_cycles: IDL.Nat,
		settle_to_records: IDL.Nat,
		archive_controllers: IDL.Opt(IDL.Opt(IDL.Vec(IDL.Principal))),
		max_active_records: IDL.Nat,
		max_records_to_archive: IDL.Nat,
		max_archive_pages: IDL.Nat,
	});
	const ArchiveLedgerInfo = IDL.Record({
		setting: ArchiveSetting,
		last_index: IDL.Nat,
		first_index: IDL.Nat,
		local_ledger_size: IDL.Nat,
		txn_count: IDL.Nat,
		archive_txn_count: IDL.Nat,
		is_cleaning: IDL.Bool,
		archives: IDL.Vec(IDL.Tuple(IDL.Principal, TransactionRange)),
	});
	const State = IDL.Record({
		archive_ledger_info: ArchiveLedgerInfo,
		fee_receiver: Account,
		create_token_fee: IDL.Vec(TokenAmount),
		token_launch_threshold: IDL.Vec(TokenAmount),
		maintainer: Account,
		maintenance: IDL.Bool,
		fee_percentage: IDL.Opt(IDL.Float32),
	});
	const Holder = IDL.Record({ balance: IDL.Nat, account: Account });
	const MemeTokenBalance = IDL.Record({
		token: MemeToken,
		balance: IDL.Nat,
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
		calculate_buy: IDL.Func([IDL.Nat64, IDL.Nat], [Result_1], ["query"]),
		calculate_sell: IDL.Func([IDL.Nat64, IDL.Nat], [Result_1], ["query"]),
		claim: IDL.Func([ClaimArg], [Result_1], []),
		create_token: IDL.Func([CreateMemeTokenArg], [Result_2], []),
		deposit: IDL.Func([DepositArgs], [Result_1], []),
		generate_random: IDL.Func([], [IDL.Nat64], []),
		getCanistergeekInformation: IDL.Func(
			[GetInformationRequest],
			[GetInformationResponse],
			["query"]
		),
		get_transactions: IDL.Func(
			[TransactionRange],
			[GetTransactionsResponse],
			["query"]
		),
		icrc10_supported_standards: IDL.Func(
			[],
			[IDL.Vec(SupportedStandard)],
			["query"]
		),
		icrc1_balance_of: IDL.Func([LedgerType, Account], [IDL.Nat], ["query"]),
		icrc21_canister_call_consent_message: IDL.Func(
			[ConsentMessageRequest],
			[Result_3],
			[]
		),
		icrc28_trusted_origins: IDL.Func([], [Icrc28TrustedOrigins], []),
		query_meme_token: IDL.Func([IDL.Nat64], [IDL.Opt(MemeToken)], ["query"]),
		query_meme_token_price: IDL.Func([IDL.Nat64], [Result_1], ["query"]),
		query_meme_tokens: IDL.Func(
			[QueryMemeTokenArgs],
			[QueryMemeTokenResponse],
			["query"]
		),
		query_state: IDL.Func([], [State], ["query"]),
		query_token_holders: IDL.Func(
			[IDL.Nat64, IDL.Nat64, IDL.Nat64],
			[IDL.Vec(Holder), IDL.Nat64],
			["query"]
		),
		query_txn_size: IDL.Func([], [IDL.Nat64], ["query"]),
		query_user_by_random: IDL.Func(
			[IDL.Nat64],
			[IDL.Opt(IDL.Principal)],
			["query"]
		),
		query_user_create_meme_tokens: IDL.Func(
			[IDL.Opt(IDL.Principal)],
			[IDL.Vec(MemeToken)],
			["query"]
		),
		query_user_tokens: IDL.Func(
			[IDL.Opt(Account)],
			[IDL.Vec(MemeTokenBalance)],
			["query"]
		),
		sell: IDL.Func([BuyArgs], [Result_1], []),
		withdraw: IDL.Func([WithdrawArgs], [Result_1], []),
	});
};
export const init = ({ IDL }: { IDL: any }) => {
	const Account = IDL.Record({
		owner: IDL.Principal,
		subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
	});
	const TokenAmount = IDL.Record({
		token: IDL.Principal,
		amount: IDL.Nat,
	});
	const InitArchiveArg = IDL.Record({
		maxRecordsToArchive: IDL.Nat,
		maxArchivePages: IDL.Nat,
		settleToRecords: IDL.Nat,
		archiveCycles: IDL.Nat,
		maxActiveRecords: IDL.Nat,
		maxRecordsInArchiveInstance: IDL.Nat,
		archiveControllers: IDL.Opt(IDL.Opt(IDL.Vec(IDL.Principal))),
	});
	const InitArg = IDL.Record({
		fee_receiver: Account,
		create_token_fee: IDL.Vec(TokenAmount),
		archive_init: IDL.Opt(InitArchiveArg),
		token_launch_threshold: IDL.Vec(TokenAmount),
		maintenance: IDL.Bool,
		fee_percentage: IDL.Opt(IDL.Float32),
	});
	return [InitArg];
};
