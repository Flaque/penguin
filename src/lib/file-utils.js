export function isSVG(path) {
  const extension = path.split(".").splice(-1)[0]
  if (extension != "svg") return false
  return true
}

export function baseName(path) {
  if (!path) throw "baseName() path is undefined! "
  return path.split("/").splice(-1)[0]
}
