import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import copy from "copy-to-clipboard";
import { Check } from "lucide-react";

import { CopyIcon } from "@/components/icons/common/copy";
import { EditIcon } from "@/components/icons/common/edit";
import { getAvatar } from "@/lib/common/avatar";
import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile/$userid")({
	component: UserId,
});

function UserId() {
	const { userid } = Route.useParams();
	const [activeTab, setActiveTab] = useState("Created");
	const [principalCopied, setPrincipalCopied] = useState(false);

	return (
		<div className="mt-5 w-full">
			<div className="mb-5 flex h-[142px] w-full gap-x-2">
				<div className="bg-gray-760 relative flex w-full gap-x-2 rounded-2xl p-5">
					<div className="flex items-center gap-2">
						<img
							alt="avatar"
							className="h-16 w-16 rounded-full"
							src={getAvatar(userid)}
						/>
						<div className="flex flex-col">
							<div className="flex items-center gap-1">
								<span className="text-lg font-semibold">
									{
										truncatePrincipal(
											userid
										) /* Use default truncation or adjust as needed */
									}
								</span>
								<EditIcon />
							</div>
							<div className="flex items-center text-xs text-gray-400">
								<span>ID: {truncatePrincipal(userid)}</span>
								{principalCopied ? (
									<Check
										className="ml-1 opacity-40"
										size={14}
										strokeWidth={"2"}
									/>
								) : (
									<CopyIcon
										className="ml-1 h-3.5 w-3.5 cursor-pointer"
										onClick={() => {
											setPrincipalCopied(true);
											copy(userid);
											setTimeout(() => {
												setPrincipalCopied(false);
											}, 2000);
										}}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="bg-gray-760 w-120 flex-shrink-0"></div>
			</div>
			<div className="mb-4 flex items-center gap-[30px] px-4">
				{["Holdings", "Created", "Activity"].map((tab) => {
					const isActive = activeTab === tab;
					return (
						<div
							key={tab}
							className={cn(
								`relative cursor-pointer py-2 text-sm font-semibold`,
								isActive ? "text-white" : "text-white/60 hover:text-white"
							)}
							onClick={() => {
								setActiveTab(tab);
							}}
						>
							{tab}
							<div
								className={cn(
									`absolute -bottom-px left-0 h-[2px] rounded-[1px] bg-white transition-all duration-300 ease-in-out`,
									isActive ? "w-full opacity-100" : "w-0 opacity-0"
								)}
								style={{
									background:
										"linear-gradient(90deg, #F7B406 0%, rgba(247, 180, 6, 0.00) 100%)",
								}}
							/>
						</div>
					);
				})}
			</div>

			<div>
				{activeTab === "Holdings" && (
					<div className="bg-gray-760 rounded-2xl p-5 text-white/60">
						Holdings data goes here...
					</div>
				)}
				{activeTab === "Created" && (
					<div className="bg-gray-760 rounded-2xl p-5 text-white/60">
						Created items table goes here... (Requires table component and data
						fetching)
					</div>
				)}
				{activeTab === "Activity" && (
					<div className="bg-gray-760 rounded-2xl p-5 text-white/60">
						Activity feed goes here...
					</div>
				)}
			</div>
		</div>
	);
}
