export const idlFactory = ({ IDL }: { IDL: any }) => {
	const StableToken = IDL.Record({
		fee: IDL.Nat,
		decimals: IDL.Nat8,
		name: IDL.Text,
		canister_id: IDL.Principal,
		symbol: IDL.Text,
	});
	const InitArg = IDL.Record({
		fee_receiver: IDL.Principal,
		ckbtc_canister: StableToken,
		create_token_fee: IDL.Opt(IDL.Nat64),
		ckbtc_launch_thread_hold: IDL.Nat,
		maintenance: IDL.Bool,
		fee_percentage: IDL.Opt(IDL.Float32),
	});
	const BuyArgs = IDL.Record({
		buy_min_token: IDL.Nat,
		boning_curve_id: IDL.Nat64,
		ckbtc_amount: IDL.Nat,
	});
	const Result = IDL.Variant({ Ok: IDL.Nat, Err: IDL.Text });
	const MetadataValue = IDL.Variant({
		Int: IDL.Int,
		Nat: IDL.Nat,
		Blob: IDL.Vec(IDL.Nat8),
		Text: IDL.Text,
	});
	const CreateMemeTokenArg = IDL.Record({
		creator: IDL.Opt(IDL.Principal),
		ticker: IDL.Text,
		twitter: IDL.Opt(IDL.Text),
		logo: MetadataValue,
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
		logo: MetadataValue,
		name: IDL.Text,
		completed: IDL.Bool,
		description: IDL.Text,
		created_at: IDL.Nat64,
		website: IDL.Opt(IDL.Text),
		market_cap_ckbtc: IDL.Nat,
		ledger_canister: IDL.Opt(IDL.Text),
		telegram: IDL.Opt(IDL.Text),
	});
	const Result_1 = IDL.Variant({ Ok: MemeToken, Err: IDL.Text });
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
	const SellArgs = IDL.Record({
		token_amount: IDL.Nat,
		boning_curve_id: IDL.Nat64,
		btc_min_amount: IDL.Nat,
	});
	return IDL.Service({
		__get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ["query"]),
		buy: IDL.Func([BuyArgs], [Result], []),
		calculate_buy: IDL.Func([IDL.Nat64, IDL.Nat], [Result], ["query"]),
		calculate_sell: IDL.Func([IDL.Nat64, IDL.Nat], [Result], ["query"]),
		create_token: IDL.Func([CreateMemeTokenArg], [Result_1], []),
		getCanistergeekInformation: IDL.Func(
			[GetInformationRequest],
			[GetInformationResponse],
			["query"]
		),
		query_meme_token: IDL.Func([IDL.Nat64], [IDL.Opt(MemeToken)], ["query"]),
		sell: IDL.Func([SellArgs], [Result], []),
	});
};
export const init = ({ IDL }: { IDL: any }) => {
	const StableToken = IDL.Record({
		fee: IDL.Nat,
		decimals: IDL.Nat8,
		name: IDL.Text,
		canister_id: IDL.Principal,
		symbol: IDL.Text,
	});
	const InitArg = IDL.Record({
		fee_receiver: IDL.Principal,
		ckbtc_canister: StableToken,
		create_token_fee: IDL.Opt(IDL.Nat64),
		ckbtc_launch_thread_hold: IDL.Nat,
		maintenance: IDL.Bool,
		fee_percentage: IDL.Opt(IDL.Float32),
	});
	return [InitArg];
};
