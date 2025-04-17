import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { useCreateMemeToken } from "@/hooks/ic/core";
// Define allowed file types for logo
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"image/svg+xml",
];
const MAX_FILE_SIZE = 1000 * 1024; // 1MB

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

	logo: z
		.any()
		.refine((file: File) => file !== undefined, { message: "Logo is required" })
		.refine((file: File) => file?.size <= MAX_FILE_SIZE, {
			message: `Max file size is 1MB`,
		})
		.refine((file: File) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
			message:
				"Only .jpg, .jpeg, .png, .webp, .svg and .gif formats are supported",
		}),

	devBuy: z
		.string()
		.optional()
		.refine(
			(value) => !value || (parseFloat(value) >= 0 && parseFloat(value) <= 0.8),
			{ message: "Dev buy must be between 0 and 0.8 (80%)" }
		),

	discountCode: z.string().optional(),

	twitter: z
		.string()
		.optional()
		.refine((value) => !value || /^@?[a-zA-Z0-9_]{1,15}$/.test(value), {
			message: "Invalid Twitter username",
		}),

	telegram: z.string().optional(),

	website: z
		.string()
		.optional()
		.refine(
			(value) =>
				!value ||
				/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
					value
				),
			{ message: "Invalid website URL" }
		),
});

export const Route = createFileRoute("/icp/create")({
	component: TokenCreationPage,
});

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

	// Form submission handler
	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await createMemeToken({
				name: values.name,
				ticker: values.symbol,
				description: values.description,
				logo: values.logo as File,
			});
			showToast("success", "Token created successfully");
		} catch (error) {
			console.error(error);
			toast.error("Failed to create token");
		}
	}

	return (
		<div className="container m-auto pb-10">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						{/* Left Column - Basic Token Information */}
						<Card className="rounded-2xl border-gray-800 bg-gray-800">
							<CardContent className="pt-6">
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
														onChange={(files) => {
															if (files.length > 0) {
																onChange(files[0]);
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
														className="border-gray-710 mt-1 rounded-xl bg-gray-800 focus-visible:ring-0"
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
														className="border-gray-710 mt-1 rounded-xl bg-gray-800 focus-visible:ring-0"
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
						<Card className="rounded-2xl border-gray-800 bg-gray-800">
							<CardContent className="space-y-6 pt-6">
								<div>
									{/* Fee Information Section */}
									<div className="mt-3 space-y-2"></div>
								</div>

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
															className="bg-gray-710 rounded-xl border-gray-700 pl-6 focus-visible:ring-0"
															{...field}
														/>
														<X className="absolute top-3 left-2 h-3 w-3 text-white/20" />
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
															className="bg-gray-710 rounded-xl border-gray-700 pl-6 focus-visible:ring-0"
															{...field}
														/>
														<Telegram className="absolute top-3 left-2 h-3 w-3 text-white/20" />
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
															className="bg-gray-710 rounded-xl border-gray-700 pl-6 focus-visible:ring-0"
															{...field}
														/>
														<Website className="absolute top-3 left-2 h-3 w-3 text-white/20" />
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Submit Button and Fee Information */}
					<div className="mt-12.5 flex flex-col items-center">
						<Button
							className="w-full max-w-md rounded-full py-6 font-medium text-black"
							disabled={isCreating}
							type="submit"
						>
							{isCreating ? "Creating..." : "Create token"}
						</Button>
						<p className="mt-3 text-sm text-gray-400">Service Fees: 0.5 ICP</p>
					</div>
				</form>
			</Form>
		</div>
	);
}
