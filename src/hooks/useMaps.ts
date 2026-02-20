import { fetchMap, findRandomMap } from "@/apis/map-api";
import { useQuery } from "@tanstack/react-query";

export function useGetRandomMap(enabled: boolean = true) {
	return useQuery({
		queryKey: ["randomMap"],
		queryFn: findRandomMap,
		enabled: enabled,
	});
}

export function useGetMap(mapId: string, enabled: boolean = true) {
	return useQuery({
		queryKey: ["map"],
		queryFn: () => fetchMap(mapId),
		enabled: enabled,
	});
}