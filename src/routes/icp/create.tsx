import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import BigNumber from "bignumber.js";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getICPCanisterId } from "@/canisters/icrc3";
import Telegram from "@/components/icons/media/telegram";
import Website from "@/components/icons/media/website";
import X from "@/components/icons/media/x";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/utils/toast";
import { FileUploader } from "@/components/views/token/bottom/file-uploader";
import { useCoreTokenBalance, useCreateMemeToken } from "@/hooks/ic/core";
import { useConnectedIdentity } from "@/hooks/providers/wallet/ic";
import { fileToBase64 } from "@/lib/common/file";
import { parseUnits } from "@/lib/common/number";
import { useDialogStore } from "@/store/dialog";
// Create form validation schema with Zod
const formSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Name is required" })
		.max(30, { message: "Name must not exceed 30 characters" }),

	symbol: z
		.string()
		.min(1, { message: "Token symbol is required" })
		.max(10, { message: "Symbol must not exceed 10 characters" }),

	description: z
		.string()
		.min(1, { message: "Description is required" })
		.max(100, { message: "Description must not exceed 100 characters" }),

	logo: z.string().url(),
	devBuy: z
		.string()
		.optional()
		.refine(
			(value) => !value || (parseFloat(value) >= 0 && parseFloat(value) <= 500),
			{ message: "Dev buy must be between 0 and 500" }
		),

	discountCode: z.string().optional(),

	twitter: z
		.string()
		.optional()
		.refine(
			(value) =>
				!value || // Allow empty optional field
				/^@?[a-zA-Z0-9_]{1,15}$/.test(value) || // Matches @username or username
				/^(https?:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]{1,15}\/?)$/.test(
					value
				), // Matches twitter.com/username or x.com/username
			{
				message:
					"Invalid Twitter handle (e.g., @handle) or profile URL (e.g., https://x.com/handle)",
			}
		),

	telegram: z
		.string()
		.optional()
		.refine(
			(value) =>
				!value || // Allow empty optional field
				/^@?[a-zA-Z0-9_]{5,32}$/.test(value) || // Matches @username or username (5-32 chars)
				/^(https?:\/\/(www\.)?t\.me\/[a-zA-Z0-9_]{5,32}\/?)$/.test(value), // Matches https://t.me/username
			{
				message:
					"Invalid Telegram handle (e.g., @handle, 5-32 chars) or link (e.g., https://t.me/handle)",
			}
		),

	website: z
		.string()
		.optional()
		.refine(
			(value) =>
				!value || // Allow empty optional field
				/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
					value
				), // General URL regex
			{ message: "Invalid website URL" }
		),
});

export const Route = createFileRoute("/icp/create")({
	component: TokenCreationPage,
});

// Helper function to clean and get handle
const getHandle = (value: string): string => {
	return value.startsWith("@") ? value.substring(1) : value;
};

// Helper function to check if a value is likely just a handle
const isHandle = (value: string): boolean => {
	// Simple check: if it doesn't start with http, assume it's a handle
	return !value.toLowerCase().startsWith("http");
};

function TokenCreationPage() {
	// Initialize form with React Hook Form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			symbol: "",
			description: "",
			devBuy: "",
			discountCode: "",
			twitter: "",
			telegram: "",
			website: "",
		},
	});

	const { mutateAsync: createMemeToken, isPending: isCreating } =
		useCreateMemeToken();
	const router = useRouter();
	// Form submission handler
	const [logoBase64String, setLogoBase64String] = useState<string>("");
	console.debug("🚀 ~ TokenCreationPage ~ logoBase64String:", logoBase64String);
	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!logoBase64String) {
			throw new Error("Logo is required");
		}
		try {
			// Prepare Twitter URL
			let twitterUrl: string | undefined = undefined;
			if (values.twitter) {
				if (isHandle(values.twitter)) {
					const handle = getHandle(values.twitter);
					twitterUrl = `https://x.com/${handle}`; // Use x.com as the current standard
				} else {
					twitterUrl = values.twitter; // Assume it's already a valid URL if not a handle
				}
			}

			// Prepare Telegram URL
			let telegramUrl: string | undefined = undefined;
			if (values.telegram) {
				if (isHandle(values.telegram)) {
					const handle = getHandle(values.telegram);
					telegramUrl = `https://t.me/${handle}`;
				} else {
					telegramUrl = values.telegram; // Assume it's already a valid URL
				}
			}
			let websiteUrl: string | undefined = undefined;
			if (values.website) {
				// Check if protocol (http:// or https://) is missing using case-insensitive regex
				if (!/^(https?:\/\/)/i.test(values.website)) {
					websiteUrl = `https://${values.website}`; // Prepend https://
				} else {
					websiteUrl = values.website; // Assume it's already a full URL
				}
			}
			const createArgs = {
				name: values.name,
				ticker: values.symbol,
				description: values.description,
				logo: values.logo,
				devBuy: values.devBuy ? BigInt(parseUnits(values.devBuy)) : undefined,
				twitter: twitterUrl,
				telegram: telegramUrl,
				website: websiteUrl,
				logoBase64: logoBase64String,
			};

			Object.keys(createArgs).forEach((key) => {
				if (createArgs[key as keyof typeof createArgs] === undefined) {
					delete createArgs[key as keyof typeof createArgs];
				}
			});

			console.log("Creating token with args:", createArgs); // Log arguments before sending

			const token = await createMemeToken(createArgs);

			void router.navigate({ to: `/icp/token/${token.id}` });
			showToast("success", "Token created successfully");
		} catch (error) {
			console.error("Failed to create token:", error);
			const errorMessage =
				error instanceof Error ? error.message : "An unknown error occurred";
			showToast("error", `Failed to create token: ${errorMessage}`);
		}
	}
	const { connected, principal } = useConnectedIdentity();
	const { setIcpConnectOpen } = useDialogStore();

	const { data: coreTokenBalance } = useCoreTokenBalance({
		owner: principal,
		token: {
			ICRCToken: getICPCanisterId(),
		},
	});

	const totalPayment = BigNumber(parseFloat(form.watch("devBuy") || "0"))
		.plus(0.5)
		.toString();
	const isBalanceEnough = BigNumber(coreTokenBalance?.raw || "0").gte(
		parseUnits(totalPayment)
	);
	return (
		<div className="container m-auto pb-10">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid grid-cols-1 gap-y-3 md:grid-cols-2 md:gap-8">
						{/* Left Column - Basic Token Information */}
						<Card className="rounded-2xl border-gray-800 bg-gray-800">
							<CardContent className="px-3 md:px-12.5">
								<div className="mb-6 flex flex-col items-center">
									{/* Logo Upload Field */}
									<FormField
										control={form.control}
										name="logo"
										render={({ field: { onChange } }) => (
											<FormItem className="flex w-full flex-col items-center">
												<FormControl>
													<FileUploader
														wrapperClassName="bg-gray-710 mb-2 flex h-25 w-25 items-center justify-center rounded-full"
														imageIcon={
															<Upload className="h-8 w-8 text-gray-400" />
														}
														onChange={async (url, file) => {
															if (url && file) {
																const logoBase64String =
																	await fileToBase64(file);
																setLogoBase64String(logoBase64String);
																onChange(url);
															}
														}}
													/>
												</FormControl>
												<FormDescription>
													<p className="text-sm text-gray-400">
														JPEG / PNG / WEBP / GIF / SVG
													</p>
													<p className="text-center text-xs text-gray-500">
														(max size 1MB)
													</p>
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="space-y-4">
									{/* Token Name Field */}
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center text-gray-400">
													Name <img alt="required" src="/svgs/required.svg" />
												</FormLabel>
												<FormControl>
													<Input
														className="border-gray-710 mt-1 h-10.5 rounded-xl bg-gray-800 focus-visible:ring-0"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Token Symbol Field */}
									<FormField
										control={form.control}
										name="symbol"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center text-gray-400">
													Token Symbol{" "}
													<img alt="required" src="/svgs/required.svg" />
												</FormLabel>
												<FormControl>
													<Input
														className="border-gray-710 mt-1 h-10.5 rounded-xl bg-gray-800 focus-visible:ring-0"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Token Description Field */}
									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<div className="flex justify-between">
													<FormLabel className="flex items-center text-gray-400">
														Token Description{" "}
														<img alt="required" src="/svgs/required.svg" />
													</FormLabel>
													<span className="text-sm text-gray-400">
														{field.value.length}/100
													</span>
												</div>
												<FormControl>
													<Textarea
														className="border-gray-710 bg-gray-710 mt-1 h-28 rounded-xl focus-visible:ring-0"
														{...field}
														onChange={(event) => {
															// Limit description to 100 characters
															const value = event.target.value.slice(0, 100);
															field.onChange(value);
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Right Column - Additional Token Settings */}
						<div className="flex flex-col gap-y-3.5">
							<Card className="rounded-2xl border-gray-800 bg-gray-800">
								<CardContent className="space-y-6 px-3 md:px-12.5">
									{/* Social Media - Twitter Field */}
									<div>
										<h3 className="mb-3 text-gray-400">Twitter (Optional)</h3>
										<FormField
											control={form.control}
											name="twitter"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<div className="relative">
															<Input
																className="bg-gray-710 h-10.5 rounded-xl border-gray-700 pl-6 focus-visible:ring-0"
																{...field}
															/>
															<X className="absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2 text-white/20" />
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Social Media - Telegram Field */}
									<div>
										<h3 className="mb-3 text-gray-400">Telegram (Optional)</h3>
										<FormField
											control={form.control}
											name="telegram"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<div className="relative">
															<Input
																className="bg-gray-710 h-10.5 rounded-xl border-gray-700 pl-6 focus-visible:ring-0"
																{...field}
															/>
															<Telegram className="absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2 text-white/20" />
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Social Media - Website Field */}
									<div>
										<h3 className="mb-3 text-gray-400">Website (Optional)</h3>
										<FormField
											control={form.control}
											name="website"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<div className="relative">
															<Input
																className="bg-gray-710 h-10.5 rounded-xl border-gray-700 pl-6 focus-visible:ring-0"
																{...field}
															/>
															<Website className="absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2 text-white/20" />
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
							<Card className="rounded-2xl border-gray-800 bg-gray-800">
								<CardContent className="space-y-6 px-3 md:px-12.5">
									<div className="flex flex-col gap-y-2">
										<span className="text-sm text-white/60">
											Dev buy (Optional)
										</span>
										<div className="relative">
											<FormField
												control={form.control}
												name="devBuy"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<div className="relative h-10.5">
																<Input
																	className="border-gray-710 h-10.5 rounded-xl bg-gray-800 pl-2.5 focus-visible:ring-0"
																	placeholder="0.00"
																	{...field}
																	onBlur={() => {
																		if (field.value) {
																			field.onChange(
																				field.value.endsWith(".")
																					? field.value.slice(0, -1)
																					: field.value
																			);
																		}
																	}}
																/>
																<img
																	alt="ICP"
																	className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2"
																	src="/svgs/chains/icp.svg"
																/>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div className="border-gray-710 mt-2 flex flex-col gap-y-2.5 rounded-xl border p-2.5">
											<div className="flex items-center justify-between">
												<span className="text-sm text-white/40">
													Launch Fee
												</span>
												<span className="text-sm text-white">0.5 ICP</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-white/40">
													Percentage
												</span>
												<span className="text-sm text-white">
													{BigNumber(parseFloat(form.watch("devBuy") || "0"))
														.div(500)
														.times(100)
														.toString()}
													%
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-white/40">
													Total Payment
												</span>
												<span className="text-sm text-white">
													{totalPayment} ICP
												</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Submit Button and Fee Information */}
					<div className="mt-12.5 flex flex-col items-center gap-2">
						{
							<div className="flex flex-col items-center">
								<span className="text-sm text-white/60">
									Balance:{" "}
									{coreTokenBalance ? coreTokenBalance?.formatted : "0"} ICP
								</span>
							</div>
						}
						{connected ? (
							<Button
								className="w-full max-w-md rounded-full py-6 text-base font-bold text-black"
								disabled={isCreating || !isBalanceEnough}
								type="submit"
							>
								{isCreating
									? "Creating..."
									: isBalanceEnough
										? "Create token"
										: "Insufficient balance"}
							</Button>
						) : (
							<Button
								className="w-full max-w-md rounded-full py-6 text-base font-bold text-black"
								type="button"
								onClick={() => {
									setIcpConnectOpen(true);
								}}
							>
								Connect Wallet
							</Button>
						)}
					</div>
				</form>
			</Form>
		</div>
	);
}
