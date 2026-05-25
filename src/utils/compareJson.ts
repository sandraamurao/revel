export interface Issue {
	field: string;
	issue: string;
	expected: string;
	actual: string;
}

function compareJson(
	expectedApiInput: Record<string, unknown>,
	actualApiInput: Record<string, unknown>,
	path: string = "",
): Issue[] {
	const issues: Issue[] = [];

	for (const key of Object.keys(expectedApiInput)) {
		const fullPath = path ? `${path}.${key}` : key;

		const expVal = expectedApiInput[key];
		const actVal = actualApiInput[key];

		// Missing in expected
		if (!(key in actualApiInput)) {
			const normalize = (k: string) => k.toLowerCase().replace(/_/g, "");

			const similarKey = Object.keys(actualApiInput).find(
				(k) => normalize(k) === normalize(key),
			);

			if (similarKey) {
				// if mismatching field names
				issues.push({
					field: fullPath,
					issue: "Naming mismatch",
					expected: key, // e.g. "userId"
					actual: similarKey, // e.g. "user_id"
				});
			} else {
				// If the key doesn't exist in expected
				issues.push({
					field: fullPath,
					issue: "Missing field",
					expected: fullPath,
					actual: "undefined/missing",
				});
			}

			continue;
		}

		// Type mismatch
		const expType = typeof expVal;
		const actType = typeof actVal;

		if (expType !== actType) {
			issues.push({
				field: fullPath,
				issue: "Type mismatch",
				expected: expType,
				actual: actType,
			});
		}

		// Recurse for objects
		if (
			expType &&
			expVal &&
			typeof expVal === "object" &&
			typeof actVal === "object" &&
			!Array.isArray(expVal) &&
			!Array.isArray(actVal)
		) {
			// If both values are plain objects (not arrays), call compareJson again on those nested objects
			issues.push(
				...compareJson(
					expVal as Record<string, unknown>,
					actVal as Record<string, unknown>,
					fullPath,
				),
			);
		}

		// Array handling
		if (Array.isArray(expVal)) {
			if (!Array.isArray(actVal)) {
				issues.push({
					field: fullPath,
					issue: "Type mismatch",
					expected: "array",
					actual: typeof actVal,
				});
				continue;
			}

			expVal.forEach((expElement, i) => {
				if (actVal[i] === undefined) {
					issues.push({
						field: `${fullPath}[${i}]`,
						issue: "Missing field",
						expected: JSON.stringify(expElement),
						actual: "undefined/missing",
					});
				} else {
					issues.push(
						...compareJson(
							expElement as Record<string, unknown>,
							actVal[i] as Record<string, unknown>,
							`${fullPath}[${i}]`,
						),
					);
				}
			});
		}
	}

	return issues;
}

export default compareJson;
