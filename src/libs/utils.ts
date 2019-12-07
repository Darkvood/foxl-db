const noDefault = Symbol("foxldb.safeGet.def");

export function isObject(value: any) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function safeGet(obj: any, path: string, defaultValue = noDefault) {
  const result = path.split(".").reduce((acc, curr) => (acc && typeof acc === "object" ? acc[curr] : undefined), obj);
  const hasDefault = defaultValue !== noDefault;

  if (result === undefined && hasDefault) {
    return defaultValue;
  } else {
    return result;
  }
}
