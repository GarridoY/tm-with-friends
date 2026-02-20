import { fetchDisplayNameFromAccountId } from "@/apis/account-api";
import { useQuery } from "@tanstack/react-query";

export function useGetDisplayNamesFromAccountIds(accountId: string, enabled: boolean = true) {
	return useQuery({
		queryKey: ["displayNames", accountId],
		queryFn: () => fetchDisplayNameFromAccountId(accountId),
		enabled: enabled,
	});
}