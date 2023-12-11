export type TestSummery = {
  numTotalTestSuites: number;
  numPassedTestSuites: number;
  numFailedTestSuites: number;
  numPendingTestSuites: number;
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  numPendingTests: number;
  numTodoTests: number;
  startTime: number;
  success: boolean;
  testResults: {
    startTime: number;
    endTime: number;
    status: string;
    message: string;
    name: string;
    assertionResults: {
      ancestorTitles: string[];
      fullName: string;
      status: string;
      title: string;
      duration: number;
      failureMessages: string[];
    }[];
  }[];
};

type CoverageItem = {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
};

export type TestCoverage = {
  [key: string]: {
    lines: CoverageItem;
    statements: CoverageItem;
    functions: CoverageItem;
    branches: CoverageItem;
    branchesTrue: CoverageItem;
  };
};
