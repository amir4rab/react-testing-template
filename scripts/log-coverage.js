import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  appendFileSync,
  rmSync,
} from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";

const log = () => {
  const filepath = resolve(cwd(), "reports", "coverage-summary.json");
  if (!existsSync(filepath)) throw new Error("Report file doesn't exits");

  const outputDir = resolve(cwd(), "action-summary");
  if (!existsSync(outputDir)) mkdirSync(outputDir);

  const summaryFile = resolve(outputDir, "summary.md");
  if (existsSync(summaryFile)) rmSync(summaryFile);

  writeFileSync(summaryFile, "## **Test Results :rocket:** \n\n");

  const fileContent = readFileSync(filepath, "utf-8");
  /** @type {import('./types').TestCoverage} */
  const coverage = JSON.parse(fileContent);

  console.log(
    `::notice title=Coverage Summary::${coverage["total"]["lines"].pct}% of lines and ${coverage["total"]["functions"].pct}% of functions are covered.`
  );

  const files = Object.keys(coverage);
  files.forEach((file, i) => {
    appendFileSync(summaryFile, `### ${file.replace(cwd(), "")}\n`);

    const items = Object.keys(coverage[file]);
    items.forEach((item) =>
      appendFileSync(summaryFile, `  - ${item}: ${coverage[file][item].pct}%\n`)
    );

    i + 1 !== files.length && appendFileSync(summaryFile, "\n");
  });
};

log();
