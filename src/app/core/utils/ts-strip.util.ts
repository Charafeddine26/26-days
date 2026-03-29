/**
 * Strips TypeScript-specific syntax so code can run in a plain JS context
 * (e.g. the web worker's `new Function()`).
 */
export function stripTypes(source: string): string {
  let code = source;

  // 1. Remove interface blocks (multiline)
  code = code.replace(/^\s*interface\s+\w[\w<>, ]*\s*\{[^}]*\}/gms, '');

  // 2. Remove type alias declarations
  code = code.replace(/^\s*type\s+\w+\s*(?:<[^>]*>)?\s*=[^;]+;/gm, '');

  // 3. Remove import/export statements
  code = code.replace(/^\s*import\s+.*from\s+['"][^'"]+['"]\s*;?\s*$/gm, '');
  code = code.replace(/^(\s*)export\s+(?:default\s+)?/gm, '$1');

  // 4. Strip Angular/TS decorators: @DecoratorName(...) or @DecoratorName
  //    Uses character-level balanced-paren matching to handle multi-line @Component({...})
  code = stripDecorators(code);

  // 5. Remove return type annotations: ): SomeType {  or  ): SomeType =>
  code = code.replace(/\)\s*:\s*(?:[A-Za-z_$][\w$.<>, \[\]|&?]*)\s*(?=[{=]|=>)/g, ') ');

  // 6. Remove type annotations — built-in TS keywords
  const builtins = 'string|number|boolean|void|any|never|unknown|null|undefined|object|symbol|bigint';
  code = code.replace(new RegExp(`(\\w)\\s*:\\s*(?:${builtins})\\b`, 'g'), '$1');
  // Custom types: PascalCase (uppercase first letter), including generics like Promise<T>
  code = code.replace(/(\w)\s*:\s*[A-Z]\w*(?:<[^>]*>)?(?:\[\])*/g, '$1');

  // 7. Remove generic type parameters on function/method calls and class declarations
  code = code.replace(/<[A-Z][A-Za-z0-9<>, \[\]|&?]*>/g, '');

  // 8. Remove access modifiers
  code = code.replace(/\b(public|private|protected|readonly)\s+/g, '');

  // 9. Remove `as Type` casts
  code = code.replace(/\s+as\s+[A-Za-z_$][\w$.<>, \[\]|&?]*/g, '');

  // 10. Remove non-null assertions
  code = code.replace(/!(?=[.\[(])/g, '');

  return code;
}

/**
 * Strips TypeScript/Angular decorators (@Component, @Injectable, @Input, etc.)
 * Uses a character-level balanced-paren scan to handle multi-line decorators.
 */
function stripDecorators(code: string): string {
  let result = '';
  let i = 0;
  while (i < code.length) {
    if (code[i] === '@' && i + 1 < code.length && /[A-Z]/.test(code[i + 1])) {
      let j = i + 1;
      // Skip decorator name (e.g. Component, Input, Injectable)
      while (j < code.length && /\w/.test(code[j])) j++;
      // If followed by '(', skip balanced parens (handles multi-line objects)
      if (j < code.length && code[j] === '(') {
        let depth = 1;
        j++;
        while (j < code.length && depth > 0) {
          if (code[j] === '(') depth++;
          else if (code[j] === ')') depth--;
          j++;
        }
      }
      // Skip trailing whitespace + optional newline
      while (j < code.length && (code[j] === ' ' || code[j] === '\t')) j++;
      if (j < code.length && code[j] === '\n') j++;
      i = j;
    } else {
      result += code[i];
      i++;
    }
  }
  return result;
}
