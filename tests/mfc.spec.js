const path = require('path');
const mfc = require('..');

const MOCKS_PATH = path.resolve('tests/mocked-fs');

const resolveDirPath = (...segments) => path.resolve(MOCKS_PATH, ...segments);

describe('given a valid directory path', () => {
  it('should return its (merged) files content', () => {
    expect(mfc(resolveDirPath())).toMatchInlineSnapshot(`
        Object {
          "a": Object {
            "b": "c",
          },
          "camelCase": Object {
            "formattedFile": Array [
              true,
            ],
          },
          "d": Object {
            "e": "f",
          },
          "g": Object {
            "h": Object {
              "i": Object {
                "j": Array [
                  "k",
                ],
              },
            },
          },
          "l": Object {
            "m": Object {
              "n": "o",
            },
          },
        }
      `);
  });
});

describe('given an array of valid directories', () => {
  it('should return its (merged) files content', () => {
    const dirs = [resolveDirPath('g'), resolveDirPath('l')];
    expect(mfc(dirs)).toMatchInlineSnapshot(`
        Object {
          "g": Object {
            "h": Object {
              "i": Object {
                "j": Array [
                  "k",
                ],
              },
            },
          },
          "l": Object {
            "m": Object {
              "n": "o",
            },
          },
        }
      `);
  });
});

describe('given a valid file path', () => {
  it('should return its contents (namespaced)', () => {
    expect(mfc(resolveDirPath('a.js'))).toMatchInlineSnapshot(`
        Object {
          "a": Object {
            "b": "c",
          },
        }
      `);
  });
});

describe('given a valid file path with useFilenames=false', () => {
  it('should return its contents', () => {
    expect(mfc(resolveDirPath('a.js'), { useFilenames: false })).toMatchInlineSnapshot(`
        Object {
          "b": "c",
        }
      `);
  });
});

describe('given an array of valid files', () => {
  it('should return its (namespace-merged) contents', () => {
    const files = [resolveDirPath('a.js'), resolveDirPath('d.json')];
    expect(mfc(files)).toMatchInlineSnapshot(`
        Object {
          "a": Object {
            "b": "c",
          },
          "d": Object {
            "e": "f",
          },
        }
      `);
  });
});

describe('given an array of valid files with useFilenames=false', () => {
  it('should return its (merged) contents', () => {
    const files = [resolveDirPath('a.js'), resolveDirPath('d.json')];
    expect(mfc(files, { useFilenames: false })).toMatchInlineSnapshot(`
        Object {
          "b": "c",
          "e": "f",
        }
      `);
  });
});

describe('given a path with symbols', () => {
  it('should properly camelCase namespaces', () => {
    expect(mfc(resolveDirPath('camel_case'), { useFilenames: false })).toMatchInlineSnapshot(`
        Object {
          "formattedFile": Array [
            true,
          ],
        }
      `);
  });
});

describe('given an array of directories and files', () => {
  it('should return its (namespace-merged) contents', () => {
    const dirs = [resolveDirPath('g'), resolveDirPath('d.json')];
    expect(mfc(dirs)).toMatchInlineSnapshot(`
        Object {
          "d": Object {
            "e": "f",
          },
          "g": Object {
            "h": Object {
              "i": Object {
                "j": Array [
                  "k",
                ],
              },
            },
          },
        }
      `);
  });
});

describe('given an array of directories and files with useFilenames=false', () => {
  it('should return its (merged) contents', () => {
    const dirs = [resolveDirPath('g'), resolveDirPath('d.json')];
    expect(mfc(dirs, { useFilenames: false })).toMatchInlineSnapshot(`
              Object {
                "e": "f",
                "h": Object {
                  "i": Object {
                    "j": Array [
                      "k",
                    ],
                  },
                },
              }
          `);
  });
});

describe('given a directory with 3 levels deep and depth=1', () => {
  it('should return only first level contents', () => {
    expect(mfc(resolveDirPath(), { depth: 1 })).toMatchInlineSnapshot(`
        Object {
          "a": Object {
            "b": "c",
          },
          "d": Object {
            "e": "f",
          },
        }
      `);
  });
});
