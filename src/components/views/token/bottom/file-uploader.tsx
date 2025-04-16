import { type ReactNode, useCallback, useState } from "react";

import { ImageIcon, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { formatBytes } from "@/lib/common/bytes";
import { withStopPropagation } from "@/lib/common/react-event";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
	onChange?: (files: Array<File>) => void;
	maxSize?: number; // in bytes
	accept?: Record<string, Array<string>>;
	imageIcon?: ReactNode;
	wrapperClassName?: string;
}

export function FileUploader({
	onChange,
	maxSize = 1 * 1024 * 1024, // 5MB
	accept = {
		"image/*": [],
	},
	imageIcon,
	wrapperClassName,
}: FileUploaderProps) {
	const [files, setFiles] = useState<Array<File>>([]);
	const [preview, setPreview] = useState<string | null>(null);
	const onDrop = useCallback(
		(acceptedFiles: Array<File>) => {
			if (acceptedFiles.length > 0) {
				const file = acceptedFiles[0];
				if (!file) return;
				setFiles([file]);
				onChange?.([file]);
				// 创建预览URL
				const reader = new FileReader();
				reader.onload = (event) => {
					setPreview(event.target?.result as string);
				};
				reader.readAsDataURL(file);
			}
		},
		[onChange]
	);

	const removeFile = () => {
		setFiles([]);
		setPreview(null);
		onChange?.([]);
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		maxFiles: 1,
		maxSize,
		accept,
	});

	return (
		<div>
			<div
				{...getRootProps()}
				className={cn(
					"relative aspect-square w-10 overflow-hidden rounded-lg",
					wrapperClassName
				)}
			>
				<input {...getInputProps()} />

				{preview ? (
					<div className="relative h-full w-full">
						<img
							alt="Preview"
							className="h-full w-full object-cover"
							src={preview}
						/>
						<button
							className="absolute top-2 right-2 rounded-full bg-gray-800/70 p-1.5 text-white/80 hover:bg-gray-700 hover:text-white"
							type="button"
							onClick={withStopPropagation(removeFile)}
						>
							<X size={16} />
						</button>
						{files.length > 0 && (
							<div className="absolute right-0 bottom-0 left-0 bg-black/50 px-2 py-1 text-xs text-white">
								{files[0]?.name} ({formatBytes(files[0]?.size ?? 0)})
							</div>
						)}
					</div>
				) : (
					<div className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-center">
						{imageIcon ?? (
							<ImageIcon
								className="h-full w-full text-gray-400"
								strokeWidth={1}
							/>
						)}
					</div>
				)}
			</div>
			{/* <p className="mt-2 text-xs text-gray-500">(JPG, PNG, GIF &lt; 1MB)</p> */}
		</div>
	);
}
