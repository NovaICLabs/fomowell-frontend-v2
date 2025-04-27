import { useCallback, useEffect, useRef, useState } from "react";

import { useThrottleCallback } from "@react-hook/throttle";
import { useParams } from "@tanstack/react-router";
import { BigNumber } from "bignumber.js";
import {
	CandlestickSeries,
	createChart,
	CrosshairMode,
	type IChartApi,
} from "lightweight-charts";

import { useTokenPriceCandle } from "@/hooks/apis/indexer";
import { formatNumberSmart } from "@/lib/common/number";

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
	const [selectedInterval, setSelectedInterval] = useState<ChartInterval>("5m");

	const containerRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<IChartApi>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const candleSeriesRef = useRef<any>();
	const now = Math.floor(Date.now());
	const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

	const { data: candleData } = useTokenPriceCandle({
		tokenId: id,
		interval: intervalMap[selectedInterval],
		start: oneWeekAgo,
		end: now,
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
					background: { color: "#161616" },
					textColor: "#d1d4dc",
				},
				grid: {
					vertLines: { color: "rgba(42, 46, 57, 0.5)" },
					horzLines: { color: "rgba(42, 46, 57, 0.5)" },
				},
				crosshair: {
					mode: CrosshairMode.Normal,
				},
			});
		}

		const chart = chartRef.current;

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
		chart.timeScale().applyOptions({
			timeVisible: true,
		});
	}, []);

	useEffect(() => {
		if (!candleSeriesRef.current || !candleData) {
			return;
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		candleSeriesRef.current.setData(candleData);
	}, [candleData]);

	const handleResize = useCallback((width: number, height: number) => {
		if (chartRef.current) {
			chartRef.current.resize(width, height);
		}
	}, []);

	const handleResizeThrottled = useThrottleCallback(handleResize, 60, true);

	useEffect(() => {
		const targetElement = containerRef.current;

		if (!targetElement) {
			return;
		}
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const newWidth = entry.contentRect?.width ?? 0;
				if (newWidth > 0) {
					handleResizeThrottled(newWidth, 390);
				}
			}
		});

		observer.observe(targetElement);
		return () => {
			observer.disconnect();
		};
	}, [handleResizeThrottled]);

	return (
		<div className="relative w-full">
			<div className="h-full w-full overflow-hidden rounded-lg bg-[#161616]">
				<div className="flex items-center border-b border-gray-800 p-4">
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
