export const getParamsSerializer = (
  params: Record<string, number | string | Array<string> | undefined>
): string => {
  const queryString = Object.entries(params).reduce((qs, [key, value]) => {
    if (value === undefined) {
      return qs;
    }

    if (typeof value === 'object' && Array.isArray(value) && value.length === 0) {
      return qs;
    }

    qs.append(key, value.toString());
    return qs;
  }, new URLSearchParams());

  return queryString.toString();
};
