import { useEffect, useMemo, useRef, useState } from "react";

// import { useParams } from "@tanstack/react-router";
import dayjs from "dayjs";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/utils/toast";
import { useCreateTokenComment, useTokenComments } from "@/hooks/apis/indexer";
import { useControllableState } from "@/hooks/common/controllable-state";
import { useTokenChainAndId } from "@/hooks/common/useTokenRouter";
import { getAvatar } from "@/lib/common/avatar";
import { truncatePrincipal } from "@/lib/ic/principal";

import { FileUploader, type FileUploaderRef } from "./file-uploader";

import type { CommentUser } from "@/apis/comment";

interface CommentProps {
	username?: string;
	comment?: string;
	timestamp?: string;
	photo?: string;
	id?: string;
	likes?: number;
	commentUser?: CommentUser;
}

const Comment = ({
	commentUser,
	username = "",
	comment = "",
	photo = "",
	timestamp = "",
	id = "",
}: CommentProps) => {
	//  MM/DD/YY HH:mm A
	const formattedTime = timestamp
		? dayjs(timestamp).format("YYYY/MM/DD HH:mm:ss")
		: "";

	return (
		<div className="bg-gray-860 flex flex-col rounded-[12px] px-[23px] py-[15px]">
			<div className="flex items-center">
				<img
					alt="avatar"
					className="h-6 w-6 rounded-full"
					src={
						commentUser && commentUser.avatar
							? commentUser.avatar
							: getAvatar(id)
					}
				/>
				<span className="ml-1.5 text-sm">
					{commentUser && commentUser.name
						? commentUser.name
						: truncatePrincipal(username)}
				</span>
				<span className="text-gray-280 ml-1.5 text-xs">{formattedTime}</span>
				{/* <div className="ml-[18px] flex cursor-pointer items-center">
					<Like className="text-gray-280" likes={likes} />
				</div> */}
			</div>
			<div className="mt-2.5 flex flex-1 overflow-y-auto text-sm">
				{photo && (
					<div className="mr-2.75 w-25 flex-shrink-0 rounded-[12px]">
						<AspectRatio className="flex" ratio={1}>
							<img alt="" className="object-contain" src={photo} />
						</AspectRatio>
					</div>
				)}
				<span className="no-scrollbar flex-1 overflow-y-auto leading-5 text-white/40">
					{comment}
				</span>
			</div>
		</div>
	);
};
export default function Comments() {
	const { id } = useTokenChainAndId();

	const { mutateAsync: createComment, isPending } = useCreateTokenComment({
		tokenId: id,
	});
	const fileUploaderRef = useRef<FileUploaderRef>(null);

	const [comment, setComment] = useControllableState({
		defaultProp: "",
	});
	const loadingRef = useRef<HTMLDivElement>(null);
	const [imgUrl, setImgUrl] = useState<string | undefined | null>();
	const [imgLoading, setImgLoading] = useState(false);
	const { data, isFetching, fetchNextPage, hasNextPage, refetch } =
		useTokenComments({
			meme_token_id: id,
			pageSize: 20,
		});

	const items = useMemo(
		() => data?.pages.flatMap((page) => page.data) ?? [],
		[data]
	);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries &&
					entries[0] &&
					entries[0].isIntersecting &&
					hasNextPage &&
					!isFetching
				) {
					void fetchNextPage();
				}
			},
			{ threshold: 0.1 }
		);

		const currentLoadingRef = loadingRef.current;
		if (currentLoadingRef) {
			observer.observe(currentLoadingRef);
		}

		return () => {
			if (currentLoadingRef) {
				observer.unobserve(currentLoadingRef);
			}
		};
	}, [fetchNextPage, hasNextPage, isFetching]);

	const handleSubmit = async () => {
		if (!comment || isPending) {
			return;
		}
		try {
			const parameters: { tokenId: string; content: string; photo?: string } = {
				tokenId: id,
				content: comment,
			};

			if (imgUrl) {
				parameters.photo = imgUrl;
			}

			await createComment(parameters);

			showToast("success", "Comment successfully");
			setComment("");
			setImgUrl(null);
			fileUploaderRef.current?.reset();
			void refetch();
		} catch (error) {
			console.error("🚀 ~ handleSubmit ~ error:", error);
			showToast("error", "Comment failed");
		}
	};

	return (
		<div className="flex flex-col">
			<div className="bg-gray-860 flex flex-col gap-0 overflow-hidden rounded-[12px]">
				<Textarea
					className="dark:bg-gray-860 h-20 border-0 px-[23px] py-5 text-base text-white placeholder:text-white/40 focus-visible:border-transparent focus-visible:ring-0"
					placeholder="Write your comments"
					value={comment}
					onChange={(event) => {
						setComment(event.target.value);
					}}
				/>
				<div className="bg-gray-860 border-gray-710 flex w-full items-end justify-between border-t p-5">
					<FileUploader
						ref={fileUploaderRef}
						isHideRemove
						defaultImage={imgUrl as string | undefined}
						isShowSize={false}
						setLoading={setImgLoading}
						onChange={setImgUrl}
					/>
					<Button
						className="h-9 rounded-full font-semibold"
						disabled={!comment || isPending || imgLoading}
						onClick={() => {
							void handleSubmit();
						}}
					>
						Submit
					</Button>
				</div>
			</div>
			<div className="no-scrollbar mt-3.75 flex h-screen flex-col gap-3 overflow-auto pb-3">
				{items.map((item) => (
					<Comment
						key={item.id}
						comment={item.content}
						commentUser={item.user}
						id={`${item.id}`}
						photo={item.photo}
						timestamp={item.createdAt}
						username={item.principal}
					/>
				))}
				<div ref={loadingRef}>
					{isFetching ? (
						<div className="py-4 text-center text-sm text-white/60">
							Loading more...
						</div>
					) : null}
					{!isFetching && items.length > 0 ? (
						<div className="py-4 text-center text-sm text-white/60">
							All comments loaded
						</div>
					) : null}
				</div>
				<div className="min-h-5 w-full">
					{!isFetching && (!items || items.length === 0) && <Empty />}
				</div>
			</div>
		</div>
	);
}
