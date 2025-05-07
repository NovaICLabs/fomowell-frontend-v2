import { useEffect, useMemo, useState } from "react";

import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/utils/toast";
import { useUpdateUserInfo } from "@/hooks/apis/indexer";
import { truncatePrincipal } from "@/lib/ic/principal";
import { useIcIdentityStore } from "@/store/ic";

import { FileUploader } from "../../token/bottom/file-uploader";

interface EditModalProps {
	open: boolean;
	initAvatar: string;
	setOpen: (open: boolean) => void;
	onSuccess: () => void;
}

const EditInfoModal = ({
	open,
	setOpen,
	initAvatar,
	onSuccess,
}: EditModalProps) => {
	const { principal, identityProfile, reloadIdentityProfile } =
		useIcIdentityStore();

	const [avatar, setAvatar] = useState<string | undefined>();
	const [nickname, setNickname] = useState<string | undefined>(
		principal ? truncatePrincipal(principal) : undefined
	);

	const { mutateAsync: updateProfile, isPending } = useUpdateUserInfo();

	// const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		// todo get user info
		if (identityProfile) {
			setNickname(identityProfile?.name);
			setAvatar(identityProfile?.avatar || initAvatar);
		}

		return () => {
			setNickname(undefined);
			setAvatar(initAvatar);
		};
	}, [initAvatar, principal, identityProfile]);

	const handleConfirm = async () => {
		try {
			if (!nickname) {
				return;
			}

			const parameters = {
				avatar: avatar,
				name: nickname,
			};

			await updateProfile(parameters);

			setOpen(false);
			showToast("success", "Update profile successfully");
			// reload user info
			onSuccess();
			void reloadIdentityProfile();
		} catch (error) {
			console.error("🚀 ~ handleConfirm ~ error:", error);
			showToast("error", "Update profile failed");
		}
	};

	const onAvatarChange = (url: string) => {
		setAvatar(url);
	};

	const reset = () => {
		setAvatar(initAvatar);
		setNickname("");
	};

	const buttonDisabled = useMemo(() => {
		return avatar && nickname ? false : true;
	}, [avatar, nickname]);

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				if (!open) {
					reset();
				}
				setOpen(open);
			}}
		>
			<DialogContent className="bg-gray-760 w-[500px] rounded-3xl">
				<DialogHeader>
					<DialogTitle>
						<div className="flex items-center gap-[30px]">Edit profile</div>
					</DialogTitle>
					<div className="mt-5 flex flex-1 flex-col p-5">
						<div>
							<FileUploader
								isHideRemove
								defaultImage={avatar}
								imageIcon={<Upload className="h-8 w-8 text-gray-400" />}
								wrapperClassName="bg-gray-710 mb-2 flex h-25 w-25 items-center justify-center rounded-full"
								onChange={(url) => {
									if (url) {
										onAvatarChange(url);
									} else {
										setAvatar(undefined);
									}
								}}
							/>
						</div>
						<div className="mt-6.25 flex w-full flex-col items-start justify-between">
							<div className="w-full px-1.5">
								<span className="text-sm text-white/60">Name</span>
							</div>
							<div className="relative mt-2 flex h-10.5 w-full items-center justify-center">
								<Input
									className="dark:bg-background h-full rounded-[10px] border-white/10 text-lg font-semibold placeholder:text-lg placeholder:leading-[14px] placeholder:font-bold placeholder:text-white/40 focus-visible:ring-0"
									placeholder="enter your name"
									value={nickname}
									onBlur={() => {
										setNickname(nickname);
									}}
									onChange={(event) => {
										const value = event.target.value.trim();
										setNickname(value);
									}}
								/>
							</div>
						</div>

						<Button
							className="mt-10 h-[42px] w-full rounded-full text-base font-bold text-black"
							disabled={buttonDisabled}
							onClick={handleConfirm}
						>
							Confirm{" "}
							{isPending && (
								<img
									alt=""
									className="h-4 w-4 animate-spin"
									src="/svgs/loading.svg"
								/>
							)}
						</Button>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
export default EditInfoModal;
