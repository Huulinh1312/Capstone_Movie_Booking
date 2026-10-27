export function unwrapList(response) {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  return data ? [data] : [];
}

export function unwrapObject(response) {
  const data = response?.data ?? response;
  return data?.content && !Array.isArray(data.content) ? data.content : data;
}
