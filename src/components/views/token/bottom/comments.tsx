import Like from "@/components/icons/common/like";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useControllableState } from "@/hooks/common/controllable-state";
import { getAvatar } from "@/lib/common/avatar";

import { FileUploader } from "./file-uploader";

interface CommentProps {
	username?: string;
	comment?: string;
	timestamp?: string;
	id?: string;
	likes?: number;
}

const Comment = ({
	username = "12321312321313212",
	comment = "DeepSeek is a meme coin he crypto world. Inspired by the playful DeepSeek is a meme coin he crypto world. Inspired by the playfuDeepSeek is a meme coin he crypto world. Inspired by the playfuDeepSeek is a meme coin he crypto world. Inspired by the playfuDeepSeek is a meme coin he crypto world. Inspired by the playfuDeepSeek is a meme coin he crypto world. Inspired by the playfu",
	timestamp = "01/31/25 12:00 PM",
	id = "112312312312312312312312",
	likes = 10,
}: CommentProps) => {
	return (
		<div className="bg-gray-860 flex h-43 flex-col rounded-[12px] px-[23px] py-[15px]">
			<div className="flex items-center">
				<img
					alt="avatar"
					className="h-6 w-6 rounded-full"
					src={getAvatar(id)}
				/>
				<span className="ml-1.5 text-sm">{username}</span>
				<span className="text-gray-280 ml-1.5 text-xs">{timestamp}</span>
				<div className="ml-[18px] flex cursor-pointer items-center">
					<Like className="text-gray-280" likes={likes} />
				</div>
			</div>
			<div className="mt-2.5 flex flex-1 overflow-y-auto text-sm">
				<div className="w-25 flex-shrink-0 rounded-[12px]">
					<AspectRatio className="flex" ratio={1}>
						<img
							alt=""
							className="object-contain"
							src="https://www.azuki.com/homepage/thumbnail-world.jpg"
						/>
					</AspectRatio>
				</div>
				<span className="no-scrollbar ml-2.75 flex-1 overflow-y-auto leading-5 text-white/40">
					{comment}
				</span>
			</div>
		</div>
	);
};
export default function Comments() {
	const [comment, setComment] = useControllableState({
		defaultProp: "",
		onChange: (value) => {
			console.log(value);
		},
	});
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
					<FileUploader />
					<Button className="h-[42px] rounded-full font-semibold">
						Submit
					</Button>
				</div>
			</div>
			<div className="no-scrollbar mt-3.75 flex h-screen flex-col gap-3 overflow-auto pb-3">
				<Comment />
				<Comment />
				<Comment />
				<Comment />
				<Comment />
				<Comment />
				<Comment />
				<Comment />
				<Comment />
				<Comment />
				<Comment />
				<Comment />
			</div>
		</div>
	);
}
