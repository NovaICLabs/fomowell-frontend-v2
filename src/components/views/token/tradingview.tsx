/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";

// import { useThrottleCallback } from "@react-hook/throttle";
import { useParams } from "@tanstack/react-router";
import { BigNumber } from "bignumber.js";
import {
	CandlestickSeries,
	createChart,
	createTextWatermark,
	CrosshairMode,
	type IChartApi,
	type IPaneApi,
	TickMarkType,
	type Time,
} from "lightweight-charts";
import { isMobile } from "react-device-detect";

import { useSingleTokenInfo, useTokenPriceCandle } from "@/hooks/apis/indexer";
import { formatNumberSmart, isNullOrUndefined } from "@/lib/common/number";
import { cn } from "@/lib/utils";

import type { CandleParameters } from "@/apis/indexer";
type ChartInterval = "1m" | "5m" | "15m" | "30m" | "1h" | "1d";
type HookInterval = CandleParameters["interval"];

const intervalMap: Record<ChartInterval, HookInterval> = {
	"1m": "minute",
	"5m": "5min",
	"15m": "15min",
	"30m": "hourly",
	"1h": "hourly",
	"1d": "daily",
};

const intervals: Array<{
	value: ChartInterval;
	label: string;
	seconds: number;
}> = [
	{ value: "1m", label: "1m", seconds: 60 },
	{ value: "5m", label: "5m", seconds: 300 },
	{ value: "15m", label: "15m", seconds: 900 },
	{ value: "30m", label: "30m", seconds: 1800 },
	{ value: "1h", label: "1H", seconds: 3600 },
	{ value: "1d", label: "1D", seconds: 86400 },
];
export default function TradingView() {
	const { id } = useParams({ from: "/icp/token/$id" });
	const [selectedInterval, setSelectedInterval] = useState<ChartInterval>("1h");

	const containerRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<IChartApi>();

	const candleSeriesRef = useRef<any>();

	const { data: candleData } = useTokenPriceCandle({
		tokenId: id,
		interval: intervalMap[selectedInterval],
	});

	const handleIntervalChange = useCallback((newInterval: ChartInterval) => {
		setSelectedInterval(newInterval);
	}, []);

	useEffect(() => {
		if (!containerRef.current) {
			return;
		}
		if (!chartRef.current) {
			chartRef.current = createChart(containerRef.current, {
				layout: {
					background: { color: "#111111" },
					textColor: "#d1d4dc",
					attributionLogo: false,
				},
				grid: {
					vertLines: { color: "rgba(42, 46, 57, 0.5)" },
					horzLines: { color: "rgba(42, 46, 57, 0.5)" },
				},
				crosshair: {
					mode: CrosshairMode.Normal,
				},
				autoSize: true,
				timeScale: {
					timeVisible: true,
					tickMarkFormatter: (time: Time, tickMarkType: TickMarkType) => {
						const date = new Date((time as number) * 1000);
						const locale = navigator.language;
						switch (tickMarkType) {
							case TickMarkType.Year:
								return date.toLocaleDateString(locale, { year: "numeric" });
							case TickMarkType.Month:
								return date.toLocaleDateString(locale, { month: "short" });
							case TickMarkType.DayOfMonth:
								return date.toLocaleDateString(locale, {
									day: "numeric",
									month: "short",
								});
							case TickMarkType.Time:
								return date.toLocaleTimeString(locale, {
									hour: "2-digit",
									minute: "2-digit",
									hour12: false,
								});
							case TickMarkType.TimeWithSeconds:
								return date.toLocaleTimeString(locale, {
									hour: "2-digit",
									minute: "2-digit",
									second: "2-digit",
									hour12: false,
								});
							default:
								return new Date((time as number) * 1000).toLocaleTimeString(
									locale,
									{ hour12: false }
								);
						}
					},
				},

				localization: {
					locale: navigator.language,
					timeFormatter: (time: number) => {
						return new Date(time * 1000).toLocaleString(navigator.language, {
							hour: "2-digit",
							minute: "2-digit",
							month: "short",
							day: "numeric",
							hour12: false,
						});
					},
				},
			});
		}

		const chart = chartRef.current;
		const firstPane = chart.panes()[0];
		createTextWatermark(firstPane as IPaneApi<Time>, {
			horzAlign: "center",
			vertAlign: "center",
			lines: [
				{
					text: "FOMOWELL",
					color: "rgba(255, 255, 255, 0.03)",
					fontSize: 150,
					fontFamily: "Albert Sans",
				},
			],
		});

		candleSeriesRef.current = chart.addSeries(CandlestickSeries, {
			upColor: "#4bffb5",
			downColor: "#ff4976",
			borderDownColor: "#ff4976",
			borderUpColor: "#4bffb5",
			wickDownColor: "#838ca1",
			wickUpColor: "#838ca1",
			priceFormat: {
				type: "custom",
				formatter: (value: string | number | BigNumber) => {
					return formatNumberSmart(BigNumber(value).toString(), {
						shortZero: true,
					});
				},
				minMove: 0.00000001,
			},
		});
		chart.priceScale("right").applyOptions({
			autoScale: true,
			borderVisible: false,
			entireTextOnly: true,
			alignLabels: true,
			ticksVisible: true,
			borderColor: "rgba(197, 203, 206, 0.5)",
			textColor: "#d1d4dc",
			scaleMargins: {
				top: 0.1,
				bottom: 0,
			},
		});
	}, []);

	useEffect(() => {
		if (!candleSeriesRef.current || !candleData) {
			return;
		}

		candleSeriesRef.current.setData(candleData);
	}, [candleData]);

	// const handleResize = useCallback((width: number, height: number) => {
	// 	if (chartRef.current) {
	// 		chartRef.current.resize(width, height);
	// 	}
	// }, []);

	// const handleResizeThrottled = useThrottleCallback(handleResize, 60, true);

	// useEffect(() => {
	// 	const targetElement = containerRef.current;

	// 	if (!targetElement) {
	// 		return;
	// 	}
	// 	const observer = new ResizeObserver((entries) => {
	// 		for (const entry of entries) {
	// 			const newWidth = entry.contentRect?.width ?? 0;
	// 			if (newWidth > 0) {
	// 				// handleResizeThrottled(newWidth, 300);
	// 			}
	// 		}
	// 	});

	// 	observer.observe(targetElement);
	// 	return () => {
	// 		observer.disconnect();
	// 	};
	// }, [handleResizeThrottled]);

	return (
		<div className="relative w-full">
			<div className="h-full w-full overflow-hidden rounded-lg">
				{isMobile && <MobileTradingViewIntervals />}
				<div
					className={cn(
						"flex items-center border-b border-gray-800 px-2.5",
						!isMobile && "p-4"
					)}
				>
					<div className="no-scrollbar flex w-full gap-1 overflow-scroll">
						{intervals.map(({ value, label }) => (
							<button
								key={value}
								type="button"
								className={`rounded-md px-3 py-1 text-xs transition-colors sm:text-sm ${
									selectedInterval === value
										? "bg-[#F6D54F] text-black"
										: "text-gray-400 hover:bg-gray-700 hover:text-white"
								}`}
								onClick={() => {
									handleIntervalChange(value);
								}}
							>
								{label}
							</button>
						))}
					</div>
				</div>
				<div ref={containerRef} className="h-[247px] w-full sm:min-h-[390px]" />
			</div>
		</div>
	);
}

const MobileTradingViewIntervals = () => {
	const { id } = useParams({ from: "/icp/token/$id" });
	const { data: tokenInfo } = useSingleTokenInfo({ id });
	const {
		priceChangeRate5M,
		priceChangeRate1H,
		priceChangeRate6H,
		priceChangeRate24H,
	} = tokenInfo ?? {};

	const mobileIntervals = [
		{ label: "5m", value: priceChangeRate5M },
		{ label: "1h", value: priceChangeRate1H },
		{ label: "6h", value: priceChangeRate6H },
		{ label: "24h", value: priceChangeRate24H },
	];

	return (
		<div className="px-2.5">
			<div className="bg-gray-860 mb-2.5 grid h-9.5 flex-shrink-0 grid-cols-4 overflow-hidden rounded-[12px]">
				{mobileIntervals.map((interval, index) => (
					<div
						key={interval.label}
						className={cn(
							"hover:bg-gray-710 flex cursor-pointer items-center justify-center gap-3",
							index < mobileIntervals.length - 1 && "border-r-gray-710 border-r"
						)}
					>
						<span className="text-xs leading-4 font-medium text-white/40">
							{interval.label}
						</span>
						<span
							className={cn(
								"text-price-positive text-xs font-medium",
								!isNullOrUndefined(interval.value) && interval.value < 0
									? "text-price-negative"
									: "text-price-positive"
							)}
						>
							{!isNullOrUndefined(interval.value) ? `${interval.value}%` : "--"}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
