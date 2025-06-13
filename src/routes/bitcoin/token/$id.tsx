import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

import Token from "@/components/views/bitcoin/token";

const SearchSchema = z.object({
	type: z.string().optional(),
});

export const Route = createFileRoute("/bitcoin/token/$id")({
	component: RouteComponent,
	validateSearch: (search) => {
		return SearchSchema.parse(search);
	},
});

function RouteComponent() {
	return <Token />;
}
