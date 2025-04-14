import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { Bitcoin, Globe, MessageSquare, Twitter, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/bitcoin/create")({
	component: TokenCreationPage,
});

function TokenCreationPage() {
	const [description, setDescription] = useState("");

	return (
		<div className="container mx-auto py-10">
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				{/* Left Column */}
				<Card className="rounded-2xl border-gray-800 bg-gray-800">
					<CardContent className="pt-6">
						<div className="mb-6 flex flex-col items-center">
							<div className="bg-gray-710 mb-2 flex h-24 w-24 items-center justify-center rounded-full">
								<Upload className="h-8 w-8 text-gray-400" />
							</div>
							<p className="text-sm text-gray-400">JPEG / PNG / WEBP / GIF</p>
							<p className="text-xs text-gray-500">(max size 200KB)</p>
						</div>

						<div className="space-y-4">
							<div>
								<Label
									className="flex items-center text-gray-400"
									htmlFor="name"
								>
									Name <span className="ml-1 text-amber-500">*</span>
								</Label>
								<Input className="mt-1 border-gray-700 bg-gray-800" id="name" />
							</div>

							<div>
								<Label
									className="flex items-center text-gray-400"
									htmlFor="symbol"
								>
									Token Symbol <span className="ml-1 text-amber-500">*</span>
								</Label>
								<Input
									className="mt-1 border-gray-700 bg-gray-800"
									id="symbol"
								/>
							</div>

							<div>
								<div className="flex justify-between">
									<Label
										className="flex items-center text-gray-400"
										htmlFor="description"
									>
										Token Description{" "}
										<span className="ml-1 text-amber-500">*</span>
									</Label>
									<span className="text-sm text-gray-400">
										{description.length}/200
									</span>
								</div>
								<Textarea
									className="mt-1 h-28 border-gray-700 bg-gray-800"
									id="description"
									value={description}
									onChange={(event) => {
										setDescription(event.target.value.slice(0, 200));
									}}
								/>
							</div>

							<Card className="mt-6 border-gray-700 bg-gray-800">
								<CardContent className="py-3">
									<h3 className="mb-1 font-medium text-white">
										Create to Earn
									</h3>
									<p className="text-sm text-gray-400">
										Earn 0.001 when a token you create successfully ascends to
										the AMM
									</p>
								</CardContent>
							</Card>
						</div>
					</CardContent>
				</Card>

				{/* Right Column */}
				<Card className="rounded-2xl border-gray-800 bg-gray-800">
					<CardContent className="space-y-6 pt-6">
						<div>
							<h3 className="mb-3 text-gray-400">Dev buy (Optional)</h3>
							<div className="relative">
								<Input
									className="border-gray-700 bg-gray-800 pr-10"
									placeholder="The maximum of 0.211 BTC"
								/>
								<div className="absolute top-2.5 right-3">
									<Bitcoin className="h-5 w-5 text-amber-500" />
								</div>
							</div>

							<div className="mt-3 space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-gray-400">Launch Fee:</span>
									<span className="text-gray-400">--</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-400">Percent supply:</span>
									<span className="text-gray-400">--</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-400">Total Payment:</span>
									<span className="text-gray-400">--</span>
								</div>
							</div>
						</div>

						<div>
							<h3 className="mb-3 text-gray-400">Discount Code (Optional)</h3>
							<Input
								className="border-gray-700 bg-gray-800"
								placeholder="Enter a discount code to create a token for free"
							/>
						</div>

						<div>
							<h3 className="mb-3 text-gray-400">Twitter (Optional)</h3>
							<div className="relative">
								<Input className="border-gray-700 bg-gray-800 pl-10" />
								<div className="absolute top-2.5 left-3">
									<Twitter className="h-5 w-5 text-gray-500" />
								</div>
							</div>
						</div>

						<div>
							<h3 className="mb-3 text-gray-400">Telegram (Optional)</h3>
							<div className="relative">
								<Input className="border-gray-700 bg-gray-800 pl-10" />
								<div className="absolute top-2.5 left-3">
									<MessageSquare className="h-5 w-5 text-gray-500" />
								</div>
							</div>
						</div>

						<div>
							<h3 className="mb-3 text-gray-400">Website (Optional)</h3>
							<div className="relative">
								<Input className="border-gray-700 bg-gray-800 pl-10" />
								<div className="absolute top-2.5 left-3">
									<Globe className="h-5 w-5 text-gray-500" />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="mt-12.5 flex flex-col items-center">
				<Button className="w-full max-w-md rounded-full py-6 font-medium text-black">
					Create token
				</Button>
				<p className="mt-3 text-sm text-gray-400">Service Fees: = 2000sats</p>
			</div>
		</div>
	);
}
