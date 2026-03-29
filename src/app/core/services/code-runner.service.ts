import { Injectable } from '@angular/core';
import { ExecutionResult, ChallengeTest } from '../models/challenge.model';

@Injectable({ providedIn: 'root' })
export class CodeRunnerService {
  private worker: Worker | null = null;
  private timeout = 5000;

  execute(code: string, tests: ChallengeTest[]): Promise<ExecutionResult> {
    return new Promise((resolve) => {
      if (this.worker) {
        this.worker.terminate();
      }

      this.worker = new Worker(
        new URL('../../../workers/code-runner.worker', import.meta.url),
        { type: 'module' }
      );

      const timer = setTimeout(() => {
        this.worker?.terminate();
        this.worker = null;
        resolve({
          status: 'timeout',
          output: [],
          testResults: [],
          error: 'Execution timed out (5 seconds)',
          executionTime: this.timeout,
        });
      }, this.timeout);

      this.worker.onmessage = ({ data }) => {
        clearTimeout(timer);
        this.worker = null;
        resolve(data as ExecutionResult);
      };

      this.worker.onerror = (e) => {
        clearTimeout(timer);
        this.worker = null;
        resolve({
          status: 'error',
          output: [],
          testResults: [],
          error: e.message || 'Unknown worker error',
          executionTime: 0,
        });
      };

      this.worker.postMessage({
        code,
        tests: tests.map((t) => ({
          description: t.description,
          testCode: t.testCode,
          hidden: t.hidden,
        })),
      });
    });
  }
}
