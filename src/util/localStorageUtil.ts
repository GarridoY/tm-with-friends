export function getGroup(): { name: string, members: string[] } | null {
	let group = null;
	if (typeof window !== "undefined") {
		group = window.localStorage.getItem("group");
	}
	return group ? JSON.parse(group) : null;
}

export function saveGroup(group: { name: string, members: string[] }) {
	if (typeof window !== "undefined") {
		localStorage.setItem("group", JSON.stringify(group));
	}
}
