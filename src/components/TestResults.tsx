import clsx from "clsx";
type TestResult = {
  testCase: number;
  description: string;
  input: any;
  expected: any;
  actual: any;
  passed: boolean;
};

interface Props {
  testResults: TestResult[];
}

export default function TestResults(props: Props) {
  const { testResults } = props;

  return (
    <div>
      {testResults.map((testResult) => (
        <div
          key={testResult.testCase}
          className={clsx(
            "m-2 rounded-md text-base p-4",
            testResult.passed ? "bg-success" : "bg-secondary",
          )}
        >
          <p>Passed: {testResult.passed ? "Success" : "Fail"}</p>
          <hr className="my-2" />
          <h3>Test Case {testResult.testCase}</h3>
          <p>Input: {JSON.stringify(testResult.input)}</p>
          <p>Expected: {JSON.stringify(testResult.expected)}</p>
          <p>Actual: {JSON.stringify(testResult.actual)}</p>
        </div>
      ))}
    </div>
  );
}
