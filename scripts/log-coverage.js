import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";

const log = () => {
  const filepath = resolve(cwd(), "reports", "coverage-summary.json");

  if (!existsSync(filepath)) throw new Error("Report file doesn't exits");

  const fileContent = readFileSync(filepath, "utf-8");
  /** @type {import('./types').TestCoverage} */
  const coverage = JSON.parse(fileContent);

  const files = Object.keys(coverage);
  files.forEach((file, i) => {
    console.log(file.replace(cwd(), ""));

    const items = Object.keys(coverage[file]);
    items.forEach((item) =>
      console.log(`  - ${item}: ${coverage[file][item].pct}%`)
    );

    i + 1 !== files.length && console.log("\n");
  });
};

log();
