export function getDisplayName(user: {
	displayName?: string | null;
	name: string;
}): string {
	return user.displayName || user.name;
}
