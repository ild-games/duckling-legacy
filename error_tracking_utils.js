const fs = require("fs");

const rawErrors = fs.readFileSync("errors.txt").toString();
fs.writeFileSync(
  "errors.json",
  JSON.stringify(
    rawErrors
      .split("\r\n")
      .filter((x) => x.includes("Error"))
      .map((x) => {
        const errNumPos = x.search(/(TS|NG)\d\d\d\d/);
        return { errNum: x.slice(errNumPos, errNumPos + 6), text: x };
      })
  )
);

console.log(
  JSON.parse(fs.readFileSync("errors.json"))
    .map((x) => x.errNum)
    .reduce((m, e) => ({ ...m, [e]: m[e] ? m[e] + 1 : 1 }), {})
);
