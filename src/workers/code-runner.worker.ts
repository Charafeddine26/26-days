/// <reference lib="webworker" />

interface WorkerMessage {
  code: string;
  tests: { description: string; testCode: string; hidden?: boolean }[];
}

interface WorkerResult {
  status: 'pass' | 'fail' | 'error' | 'timeout';
  output: string[];
  testResults: { description: string; passed: boolean; expected?: string; received?: string }[];
  error?: string;
  executionTime: number;
}

addEventListener('message', async ({ data }: MessageEvent<WorkerMessage>) => {
  const { code, tests } = data;
  const output: string[] = [];
  const testResults: WorkerResult['testResults'] = [];
  const startTime = performance.now();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

  // Capture console.log
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    output.push(args.map(a => {
      if (typeof a === 'object') return JSON.stringify(a);
      return String(a);
    }).join(' '));
  };

  try {
    // Execute player code
    const fn = new Function(code);
    fn();

    // Run tests
    for (const test of tests) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const testFn = new AsyncFunction(code + '\n' + test.testCode);
        await testFn();
        testResults.push({ description: test.description, passed: true });
      } catch (e: any) {
        const msg = e.message || String(e);
        testResults.push({
          description: test.description,
          passed: false,
          expected: msg,
          received: 'Error',
        });
      }
    }

    const allPassed = testResults.length > 0 && testResults.every(t => t.passed);
    const result: WorkerResult = {
      status: testResults.length === 0 ? 'pass' : (allPassed ? 'pass' : 'fail'),
      output,
      testResults,
      executionTime: performance.now() - startTime,
    };

    console.log = originalLog;
    postMessage(result);
  } catch (e: any) {
    console.log = originalLog;
    const result: WorkerResult = {
      status: 'error',
      output,
      testResults,
      error: e.message || String(e),
      executionTime: performance.now() - startTime,
    };
    postMessage(result);
  }
});
