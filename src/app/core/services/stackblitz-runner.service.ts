import { Injectable, NgZone } from '@angular/core';
import sdk, { VM } from '@stackblitz/sdk';
import { ChallengeFile } from '../models/challenge.model';

export interface StackBlitzProject {
  vm: VM;
  destroy: () => void;
}

@Injectable({ providedIn: 'root' })
export class StackBlitzRunnerService {
  constructor(private ngZone: NgZone) {}

  /**
   * Embeds a StackBlitz project into `element`.
   * Returns a handle with `vm` (for file access) and `destroy` (for cleanup).
   */
  async embed(element: HTMLElement, files: ChallengeFile[]): Promise<StackBlitzProject> {
    const projectFiles: Record<string, string> = {};
    for (const f of files) {
      projectFiles[f.name] = f.content;
    }

    const vm = await this.ngZone.runOutsideAngular(() =>
      sdk.embedProject(
        element,
        {
          title: 'Challenge',
          description: '',
          template: 'typescript',
          files: projectFiles,
        },
        {
          height: '100%',
          hideNavigation: true,
          hideDevTools: false,
          devToolsHeight: 200,
          openFile: this.resolveOpenFile(files),
          theme: 'dark',
        }
      )
    );

    return {
      vm,
      destroy: () => {
        const iframe = element.querySelector('iframe');
        if (iframe) iframe.remove();
      },
    };
  }

  /**
   * Returns the current file system snapshot from the running VM.
   * Keys are filenames, values are file contents.
   */
  async getFiles(vm: VM): Promise<Record<string, string>> {
    return (await vm.getFsSnapshot()) ?? {};
  }

  /**
   * Returns only the editable files from the snapshot (excludes readOnly ones).
   */
  async getEditableFiles(vm: VM, originalFiles: ChallengeFile[]): Promise<ChallengeFile[]> {
    const snapshot = await this.getFiles(vm);
    const readOnlyNames = new Set(
      originalFiles.filter(f => f.readOnly).map(f => f.name)
    );

    return originalFiles.map(f => ({
      ...f,
      content: readOnlyNames.has(f.name) ? f.content : (snapshot[f.name] ?? f.content),
    }));
  }

  /** Opens the first non-readOnly file by default. */
  private resolveOpenFile(files: ChallengeFile[]): string {
    const editable = files.find(f => !f.readOnly);
    return editable?.name ?? files[0]?.name ?? 'index.ts';
  }
}
