import {
	forwardRef,
	type ReactNode,
	useCallback,
	useImperativeHandle,
	useState,
} from "react";

import { ImageIcon, X } from "lucide-react";
import { type FileRejection, useDropzone } from "react-dropzone";

import { uploadImage } from "@/apis/image";
import { formatBytes } from "@/lib/common/bytes";
import { withStopPropagation } from "@/lib/common/react-event";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
	isHideRemove?: boolean;
	onChange?: (url: string | null, file?: File) => void;
	maxSize?: number; // in bytes
	accept?: Record<string, Array<string>>;
	imageIcon?: ReactNode;
	defaultImage?: string;
	wrapperClassName?: string;
	isShowSize?: boolean;
	setLoading?: (loading: boolean) => void;
	option?: {
		alwaysShowEdit?: boolean;
	};
}

export interface FileUploaderRef {
	reset: () => void;
}

export const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(
	(
		{
			onChange,
			maxSize = 2 * 1024 * 1024, // 1MB
			accept = {
				"image/*": [],
			},
			imageIcon,
			defaultImage,
			isHideRemove = false,
			option,
			isShowSize = true,
			wrapperClassName,
			setLoading,
		}: FileUploaderProps,
		ref
	) => {
		const [files, setFiles] = useState<Array<File>>([]);
		const [preview, setPreview] = useState<string | null>(defaultImage || null);
		const [error, setError] = useState<string | null>(null);
		const { alwaysShowEdit } = option ?? {};
		const onDrop = useCallback(
			(acceptedFiles: Array<File>, rejectedFiles: Array<FileRejection>) => {
				if (acceptedFiles.length > 0) {
					const file = acceptedFiles[0];
					if (!file) return;
					setFiles([file]);

					setLoading?.(true);
					void uploadImage(file).then((url) => {
						onChange?.(url, file);
						setLoading?.(false);
					});
					const reader = new FileReader();
					reader.onload = (event) => {
						setPreview(event.target?.result as string);
					};
					reader.readAsDataURL(file);
				}
				if (rejectedFiles.length > 0) {
					setError(rejectedFiles[0]?.errors?.[0]?.message ?? null);
				}
			},
			[onChange, setLoading]
		);

		const removeFile = () => {
			setFiles([]);
			setPreview(null);
			onChange?.(null);
		};

		const reset = useCallback(() => {
			setFiles([]);
			setPreview(null);
			onChange?.(null);
		}, [onChange]);

		useImperativeHandle(
			ref,
			() => ({
				reset,
			}),
			[reset]
		);

		const { getRootProps, getInputProps } = useDropzone({
			onDrop,
			maxFiles: 1,
			maxSize,
			accept,
		});

		return (
			<div className="flex flex-col items-center justify-center">
				<div
					{...getRootProps()}
					className={cn(
						"relative aspect-square w-10 overflow-hidden rounded-lg",
						wrapperClassName
					)}
				>
					<input
						{...getInputProps()}
						onClick={withStopPropagation(() => {
							setError(null);
						})}
					/>

					{preview ? (
						<div className="group relative h-full w-full cursor-pointer">
							<img
								alt="Preview"
								className="h-full w-full object-cover"
								src={preview}
							/>
							{!isHideRemove && (
								<div
									className="absolute top-3 right-3 rounded-full bg-gray-800/70 p-1.5 text-white/80 hover:bg-gray-700 hover:text-white"
									onClick={withStopPropagation(removeFile)}
								>
									<X size={16} />
								</div>
							)}
							{alwaysShowEdit && (
								<div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-full bg-gray-500/40 opacity-100 transition-all">
									<img alt="upload-svg" src={"/svgs/upload.svg"} />
								</div>
							)}
							{isShowSize && files.length > 0 && (
								<div className="absolute right-0 bottom-0 left-0 bg-black/50 px-2 py-1 text-center text-xs text-white">
									({formatBytes(files[0]?.size ?? 0)})
								</div>
							)}
						</div>
					) : (
						<>
							<div className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-center">
								{imageIcon ?? (
									<ImageIcon
										className="h-full w-full text-gray-400"
										strokeWidth={1}
									/>
								)}
							</div>
						</>
					)}
				</div>
				{error && <p className="mt-2 text-xs text-red-500">{error}</p>}
				{/* <p className="mt-2 text-xs text-gray-500">(JPG, PNG, GIF &lt; 1MB)</p> */}
			</div>
		);
	}
);
