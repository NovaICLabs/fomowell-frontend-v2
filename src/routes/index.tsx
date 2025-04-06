import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const Home = () => {
	const { t, i18n } = useTranslation();

	const onTranslateButtonClick = async (): Promise<void> => {
		if (i18n.resolvedLanguage === "en") {
			await i18n.changeLanguage("es");
		} else {
			await i18n.changeLanguage("en");
		}
	};

	return (
		<div className="bg-blue-300  font-bold w-screen h-screen flex flex-col justify-center items-center">
			<p className="text-white text-6xl">{t("home.greeting")}</p>
			<button
				className="bg-red-300"
				type="submit"
				onClick={onTranslateButtonClick}
			>
				translate
			</button>
		</div>
	);
};

export const Route = createFileRoute("/")({
	component: Home,
});
