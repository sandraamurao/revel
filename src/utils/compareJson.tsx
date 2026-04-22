export interface Issue {
	field: string;
	issue: string;
	expected: string;
	actual: string;
}

function compareJson(
	request: Record<string, unknown>,
	response: Record<string, unknown>,
	path: string = "",
): Issue[] {
	const issues: Issue[] = [];

	for (const key of Object.keys(request)) {
		const fullPath = path ? `${path}.${key}` : key;

		const reqVal = request[key];
		const resVal = response[key];

		// Missing in response
		if (!(key in response)) {
			// If the key doesn't exist in response
			issues.push({
				field: fullPath,
				issue: "Missing field",
				expected: JSON.stringify(reqVal),
				actual: "undefined",
			});
			continue;
		}

		// Type mismatch
		const reqType = typeof reqVal;
		const resType = typeof resVal;

		if (reqType !== resType) {
			issues.push({
				field: fullPath,
				issue: "Type mismatch",
				expected: reqType,
				actual: resType,
			});
		}

		// Recurse for objects
		if (
			reqType &&
			reqVal &&
			typeof reqVal === "object" &&
			typeof resVal === "object" &&
			!Array.isArray(reqVal) &&
			!Array.isArray(resVal)
		) {
			// If both values are plain objects (not arrays), call compareJson again on those nested objects
			issues.push(
				...compareJson(
					reqVal as Record<string, unknown>,
					resVal as Record<string, unknown>,
					fullPath,
				),
			);
		}

		// Array handling
		if (Array.isArray(reqVal)) {
			if (!Array.isArray(resVal)) {
				issues.push({
					field: fullPath,
					issue: "Type mismatch",
					expected: "array",
					actual: typeof resVal,
				});
				continue;
			}

			reqVal.forEach((reqElement, i) => {
				if (resVal[i] === undefined) {
					issues.push({
						field: `${fullPath}[${i}]`,
						issue: "Missing field",
						expected: JSON.stringify(reqElement),
						actual: "undefined",
					});
				} else {
					issues.push(
						...compareJson(
							reqElement as Record<string, unknown>,
							resVal[i] as Record<string, unknown>,
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
