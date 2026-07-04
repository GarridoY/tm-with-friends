import { fetchMapRecords } from "@/apis/map-records-api";
import { useQuery } from "@tanstack/react-query";

export function useGetMapRecords(accounts: string[], mapId: string, enabled: boolean = true) {
	return useQuery({
		queryKey: ["mapRecords", accounts, mapId],
		queryFn: () => fetchMapRecords(accounts, mapId),
		enabled: enabled,
	});
}