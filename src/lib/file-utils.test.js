let {baseName, isSVG} = require('./file-utils.js')

test("baseName correctly gets the base name of a file", () => {
  expect(baseName("path/to/file/thing.svg")).toBe("thing.svg")
})
