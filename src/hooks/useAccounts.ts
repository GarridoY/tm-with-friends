import { fetchDisplayNameFromAccountId, fetchAccountIdsFromDisplayNames } from "@/apis/account-api";
import { useQuery } from "@tanstack/react-query";

export function useGetDisplayNameFromAccountId(accountId: string, enabled: boolean = true) {
	return useQuery({
		queryKey: ["displayNames", accountId],
		queryFn: () => fetchDisplayNameFromAccountId(accountId),
		enabled: enabled,
	});
}

export function useGetAccountIdsFromDisplayNames(displayNames: string[], enabled: boolean = true) {
	return useQuery({
		queryKey: ["accountIds", displayNames],
		queryFn: () => fetchAccountIdsFromDisplayNames(displayNames),
		enabled: enabled,
	});
}