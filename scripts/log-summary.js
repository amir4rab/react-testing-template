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
  const filepath = resolve(cwd(), "reports", "test-summery.json");
  if (!existsSync(filepath)) throw new Error("Report file doesn't exits");

  const outputDir = resolve(cwd(), "action-summary");
  if (!existsSync(outputDir)) mkdirSync(outputDir);

  const summaryFile = resolve(outputDir, "summary.md");
  if (existsSync(summaryFile)) rmSync(summaryFile);

  const fileContent = readFileSync(filepath, "utf-8");
  /** @type {import('./types').TestSummery} */
  const {
    success,
    numFailedTests,
    numTotalTests,
    numPassedTests,
    testResults,
  } = JSON.parse(fileContent);

  writeFileSync(summaryFile, "## **Test Results :rocket:** \n");
  appendFileSync(
    summaryFile,
    `### Passed ${numPassedTests} of ${numTotalTests} while failing ${numFailedTests}\n\n`
  );

  console.log(
    `::notice title=Tests Summery::Passed ${numPassedTests} of ${numTotalTests} ${
      numFailedTests !== 0
        ? "while failing " + numFailedTests + " tests"
        : "tests"
    }`
  );

  testResults.forEach(({ name, assertionResults, status }, index) => {
    const cleanedName = name.replace(cwd(), "");

    appendFileSync(
      summaryFile,
      `### ${cleanedName} ${
        status === "passed" ? ":white_check_mark:" : ":x:"
      }\n`
    );
    assertionResults.forEach(({ fullName, status }) => {
      appendFileSync(
        summaryFile,
        `  -${fullName} ${status === "passed" ? ":white_check_mark:" : ":x:"}\n`
      );
    });
    index + 1 !== testResults.length && appendFileSync(summaryFile, "\n");
  });
};

log();
