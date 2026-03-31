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

// ---------------------------------------------------------------------------
// Lightweight DOM mock for Day 6 (DOM Manipulation) challenges
// ---------------------------------------------------------------------------

function createMockDOM() {
  const registry = new Map<string, MockElement>();

  class MockElement {
    tagName: string;
    _textContent = '';
    style: Record<string, string> = {};
    _classes = new Set<string>();
    _attrs = new Map<string, string>();
    _children: MockElement[] = [];
    _listeners = new Map<string, Array<(e?: any) => void>>();
    _id = '';

    constructor(tagName: string) {
      this.tagName = tagName.toUpperCase();
    }

    get id() { return this._id; }
    set id(val: string) {
      this._id = val;
      if (val) registry.set(val, this);
    }

    get textContent() { return this._textContent; }
    set textContent(val: string) { this._textContent = String(val); }

    get innerHTML() { return this._textContent; }
    set innerHTML(val: string) { this._textContent = val; }

    get classList() {
      // Return a plain object each time so it stays usable
      const classes = this._classes;
      return {
        add: (cls: string) => classes.add(cls),
        remove: (cls: string) => classes.delete(cls),
        contains: (cls: string) => classes.has(cls),
        toggle: (cls: string) => classes.has(cls) ? classes.delete(cls) : classes.add(cls),
      };
    }

    appendChild(child: MockElement) {
      this._children.push(child);
      if (child._id) registry.set(child._id, child);
      return child;
    }

    setAttribute(name: string, value: string) {
      this._attrs.set(name, String(value));
      if (name === 'id') this.id = value;
    }

    getAttribute(name: string) {
      return this._attrs.get(name) ?? null;
    }

    addEventListener(event: string, handler: (e?: any) => void) {
      if (!this._listeners.has(event)) this._listeners.set(event, []);
      this._listeners.get(event)!.push(handler);
    }

    click() {
      const handlers = this._listeners.get('click') || [];
      handlers.forEach(h => h({ type: 'click', target: this }));
    }

    querySelector(selector: string) {
      return findElement(this._children, selector);
    }

    querySelectorAll(selector: string) {
      return findAllElements(this._children, selector);
    }
  }

  function matchesSelector(el: MockElement, selector: string): boolean {
    if (selector.startsWith('#')) return el._id === selector.slice(1);
    if (selector.startsWith('.')) return el._classes.has(selector.slice(1));
    return el.tagName === selector.toUpperCase();
  }

  function findElement(children: MockElement[], selector: string): MockElement | null {
    for (const child of children) {
      if (matchesSelector(child, selector)) return child;
      const found = findElement(child._children, selector);
      if (found) return found;
    }
    return null;
  }

  function findAllElements(children: MockElement[], selector: string): MockElement[] {
    const results: MockElement[] = [];
    for (const child of children) {
      if (matchesSelector(child, selector)) results.push(child);
      results.push(...findAllElements(child._children, selector));
    }
    return results;
  }

  // Pre-seed common fixture elements referenced by day 6 tests
  function seedElement(tag: string, id: string, text = '', classes: string[] = []) {
    const el = new MockElement(tag);
    el.id = id;
    el._textContent = text;
    classes.forEach(c => el._classes.add(c));
    return el;
  }

  seedElement('div', 'status', 'Online');
  seedElement('div', 'display', 'Waiting...');
  seedElement('div', 'panel', 'Content', ['drift-panel']);

  const body = new MockElement('body');

  const mockDocument = {
    body,
    createElement(tagName: string) {
      return new MockElement(tagName);
    },
    getElementById(id: string) {
      return registry.get(id) ?? null;
    },
    querySelector(selector: string) {
      return findElement(body._children, selector);
    },
    querySelectorAll(selector: string) {
      return findAllElements(body._children, selector);
    },
  };

  return mockDocument;
}

// ---------------------------------------------------------------------------
// Worker message handler
// ---------------------------------------------------------------------------

addEventListener('message', async ({ data }: MessageEvent<WorkerMessage>) => {
  const { code, tests } = data;
  const output: string[] = [];
  const testResults: WorkerResult['testResults'] = [];
  const startTime = performance.now();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

  // Detect whether this code needs a DOM mock
  const allCode = code + tests.map(t => t.testCode).join('\n');
  const needsDOM = /\bdocument\b/.test(allCode);

  // Capture console.log
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    output.push(args.map(a => {
      if (typeof a === 'object') return JSON.stringify(a);
      return String(a);
    }).join(' '));
  };

  try {
    // Execute player code (for console output preview)
    if (needsDOM) {
      const fn = new Function('document', code);
      fn(createMockDOM());
    } else {
      const fn = new Function(code);
      fn();
    }

    // Run tests — each gets a fresh DOM so they're fully isolated
    for (const test of tests) {
      try {
        const combined = code + '\n' + test.testCode;
        if (needsDOM) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          const testFn = new AsyncFunction('document', combined);
          await testFn(createMockDOM());
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          const testFn = new AsyncFunction(combined);
          await testFn();
        }
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
