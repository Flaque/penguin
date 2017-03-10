export function isSVG(path) {
  const extension = path.split(".").splice(-1)
  if (extension != "svg") return false
  return true
}
