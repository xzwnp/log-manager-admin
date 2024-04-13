export function copyObject(sourceObj: any, ignoredFields?: string[]) {
  let targetObj: any = {};
  for (let key in sourceObj) {
    if (ignoredFields && ignoredFields.includes(key)) {
      continue;
    }
    targetObj[key] = sourceObj[key];
  }
  return targetObj;
}


export function notBlank(str: string) {
  return str && str.trim().length > 0;
}

export function parseEnums(enums: any, code: number) {
  for (let key in enums) {
    if (enums[key].value === code) {
      return enums[key].label;
    }
  }
  return null;
}
