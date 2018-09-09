export default function collectionJoinStr(obj) {
  return Object.keys(obj)
    .map(key => obj[key])
    .join(',');
}
