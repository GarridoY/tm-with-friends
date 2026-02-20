import { FindRandomMap } from "@/apis/map-api";
import { useQuery } from "@tanstack/react-query";

export function useGetRandomMap(enabled: boolean = true) {
	return useQuery({
		queryKey: ["randomMap"],
		queryFn: FindRandomMap,
		enabled: enabled,
	});
}