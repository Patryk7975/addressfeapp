interface ErrorApiResponse {
    response: {
        data: {
            ValidationResult: {
                brokenRules: {
                    message: string,
                    severity: string
                }[],
            }
        }
    }
}

export function deepCapitalize(obj: any): any {
    if (typeof obj === 'string') {
        return capitalizeFirstLetter(obj);
    } else if (Array.isArray(obj)) {
        return obj.map(deepCapitalize);
    } else if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const key in obj) {
            if (dictionaryNames.indexOf(key) >= 0) {
                result[key] = deepCapitalize(obj[key]);
            } else if (lowercaseDictionaryNames.indexOf(key) >= 0) {
                result[key] = obj[key]?.toLowerCase();
            } else {
                result[key] = obj[key];
            }
        }
        return result;
    }
    return obj;
}

function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const dictionaryNames = ['usage', 'status', 'type', 'changeSource', 'changeBasis', 'id', 'instanceId', 'placeOfStay', 'country', 'usages'];

const lowercaseDictionaryNames = ['streetPrefix'];

export const handleError = (error: unknown) => {
    const parsedError = error as ErrorApiResponse;
    if (parsedError) {
        const rules = parsedError.response.data.ValidationResult.brokenRules;
        let message = "";
        for (let r of rules) {
            if (r.severity.toLowerCase() == "error")
                message += r.message + " ";
        }
        alert(message)
    }
    else {
        alert(error);
    }
}

export const normalizeDateInRequest = (date: string | null) =>
    date ? `${date}T00:00:00.000Z` : date == "" ? null : date;