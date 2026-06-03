import type { Issue } from "./compareJson";

interface DataMapRow {
	requestKey: string | null;
	responseKey: string | null;
	requestValue: unknown;
	responseValue: unknown;
	status:
		| "match"
		| "type-mismatch"
		| "naming-mismatch"
		| "missing-request"
		| "missing-response"
		| "missing"
		| "extra";
}

export function buildDataRows(
  issues: Issue[],
  flatRequest: Record<string, unknown>,
  flatResponse: Record<string, unknown>,
  truth: string
): DataMapRow[] {
    const isReqTruth = truth === "Request";
	const getReqKey = (expected: string, actual: string) =>
		isReqTruth ? expected : actual;
	const getResKey = (expected: string, actual: string) =>
		isReqTruth ? actual : expected;

	const issueActuals = issues.map(i => i.actual);

    // Get all keys (of req/res) that are not in issue
	const allKeys = [...new Set([
	...Object.keys(isReqTruth ? flatRequest : flatResponse),
	...Object.keys(isReqTruth ? flatResponse : flatRequest)
	])].filter(key => !issueActuals.includes(key));

    // Map rows for each property line of request and response
	const rows: DataMapRow[] = allKeys.map((key) => {
		const issue = issues.find((i) => i.field === key);
		const inTruth = key in (isReqTruth ? flatRequest : flatResponse)

		// if key is not in source of truth, it's an "extra key"
		if (!inTruth) return {
			requestKey: isReqTruth ? null : key,
			responseKey: isReqTruth ? key : null,
			requestValue: isReqTruth ? null : flatRequest[key],
			responseValue: isReqTruth ? flatResponse[key] : null,
			status: "extra" as DataMapRow["status"]
		}

		if (!issue || issue.issue === "Type mismatch")
			return {
				requestKey: key,
				responseKey: key,
				requestValue: flatRequest[key],
				responseValue: flatResponse[key],
				status: !issue ? "match" : "type-mismatch",
			};

		if (issue.issue === "Naming mismatch")
			return {
				requestKey: getReqKey(issue.expected, issue.actual),
				responseKey: getResKey(issue.expected, issue.actual),
				requestValue: flatRequest[getReqKey(issue.expected, issue.actual)],
				responseValue: flatResponse[getResKey(issue.expected, issue.actual)],
				status: "naming-mismatch",
			};

		if (issue.issue === "Missing field")
			return {
				requestKey: isReqTruth ? key : null,
				responseKey: isReqTruth ? null : key,
				requestValue: isReqTruth ? flatRequest[key] : null,
				responseValue: isReqTruth ? null : flatResponse[key],
				status: isReqTruth ? "missing-response" : "missing-request",
			};
		
		// Fallback
		/* TypeScript requires all code paths to return a value.
			All issue types are handled above, but TypeScript can't verify that at compile time.
		 	This fallback prevents a "not all code paths return a value" error. */
		return {
			requestKey: key,
			responseKey: key,
			requestValue: flatRequest[key],
			responseValue: flatResponse[key],
			status: "match" as DataMapRow["status"]
		}
	});

    return rows;
}
