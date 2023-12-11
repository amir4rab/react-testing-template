import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";

const log = () => {
  const filepath = resolve(cwd(), "reports", "test-summery.json");

  if (!existsSync(filepath)) throw new Error("Report file doesn't exits");

  const fileContent = readFileSync(filepath, "utf-8");
  /** @type {import('./types').TestSummery} */
  const {
    success,
    numFailedTests,
    numTotalTests,
    numPassedTests,
    testResults,
  } = JSON.parse(fileContent);

  success && console.log(`The test were executed Successfully`);

  console.log(
    `Passed ${numPassedTests} of ${numTotalTests} while failing ${numFailedTests}\n`
  );

  testResults.forEach(({ name, assertionResults, status }, index) => {
    const cleanedName = name.replace(cwd(), "");

    console.log(
      `${cleanedName} ${status === "passed" ? ":white_check_mark:" : ":x:"}`
    );
    assertionResults.forEach(({ fullName, status }) => {
      console.log(
        `  -${fullName} ${status === "passed" ? ":white_check_mark:" : ":x:"}`
      );
    });
    index + 1 !== testResults.length && console.log("\n");
  });
};

log();
