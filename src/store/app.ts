import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type TypeWalletMode = "wallet" | "contract";

interface AppState {
	invitationCode2ic: string;
	setInvitationCode2ic: (invitationCode: string) => void;

	invitationCode2btc: string;
	setInvitationCode2btc: (invitationCode: string) => void;
}

const STORAGE_KEY = "fomowell-app-store";

export const useAppStore = create<AppState>()(
	devtools(
		persist(
			(set) => ({
				invitationCode2ic: "",
				setInvitationCode2ic: (invitationCode2ic) => {
					set({ invitationCode2ic });
				},

				invitationCode2btc: "",
				setInvitationCode2btc: (invitationCode2btc) => {
					set({ invitationCode2btc });
				},
			}),
			{
				name: STORAGE_KEY,
			}
		),
		{
			name: "AppStore",
		}
	)
);
