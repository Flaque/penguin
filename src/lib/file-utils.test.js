let {baseName, isSVG, setExtension} = require('./file-utils.js')

test("baseName correctly gets the base name of a file", () => {
  expect(baseName("path/to/file/thing.svg")).toBe("thing.svg")
})

test("setExtension correctly sets the extension", () => {
  expect(setExtension("path/to/file/thing.svg", "png"))
    .toBe("path/to/file/thing.png")
})
