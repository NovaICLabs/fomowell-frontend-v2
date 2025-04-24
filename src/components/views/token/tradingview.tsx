import { useCallback, useEffect, useRef, useState } from "react";

import { useParams } from "@tanstack/react-router";
import { createChart, type IChartApi } from "lightweight-charts";

import { useTokenPriceCandle } from "@/hooks/apis/indexer";

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
		if (!containerRef.current || !candleData) {
			if (chartRef.current) {
				chartRef.current.remove();
				chartRef.current = undefined;
			}
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
					mode: 1,
					vertLine: {
						color: "#758696",
						width: 1,
						style: 3,
						labelBackgroundColor: "#758696",
					},
					horzLine: {
						color: "#758696",
						width: 1,
						style: 3,
						labelBackgroundColor: "#758696",
					},
				},
				width: containerRef.current.clientWidth,
				height: containerRef.current.clientHeight,
			});
		}

		const chart = chartRef.current;

		chart.priceScale("right").applyOptions({
			autoScale: true,
			scaleMargins: { top: 0.1, bottom: 0.05 },
			borderVisible: false,
			entireTextOnly: true,
			mode: 0,
			invertScale: false,
			alignLabels: true,
			ticksVisible: true,
			borderColor: "rgba(197, 203, 206, 0.5)",
			textColor: "#d1d4dc",
		});
		chart.timeScale().applyOptions({
			timeVisible: true,
			secondsVisible: selectedInterval === "1m",
			borderVisible: false,
		});

		chart.timeScale().fitContent();

		const handleResize = () => {
			if (chartRef.current && containerRef.current) {
				chartRef.current.resize(
					containerRef.current.clientWidth,
					containerRef.current.clientHeight
				);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [candleData, selectedInterval]);

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
