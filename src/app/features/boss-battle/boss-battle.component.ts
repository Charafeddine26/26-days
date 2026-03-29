import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Challenge, Day, ExecutionResult } from '../../core/models/challenge.model';
import { ChallengeService } from '../../core/services/challenge.service';
import { CodeRunnerService } from '../../core/services/code-runner.service';
import { ProgressService } from '../../core/services/progress.service';
import { DriftStateService } from '../../core/services/drift-state.service';
import { StackBlitzRunnerService, StackBlitzProject } from '../../core/services/stackblitz-runner.service';
import { stripTypes } from '../../core/utils/ts-strip.util';
import { EditorComponent, NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import {
  LucideAngularModule,
  Eye, Bug, Code, RefreshCw, Layers,
  CircleCheck, CircleX, Lightbulb,
  ChevronLeft, Play, Send, Loader, Clock,
} from 'lucide-angular';
import { playBloom } from '../../core/utils/gsap-effects.util';

@Component({
  selector: 'app-boss-battle',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorComponent, LucideAngularModule],
  providers: [
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: {
        baseUrl: './assets/monaco/vs',
        defaultOptions: { scrollBeyondLastLine: false },
        onMonacoLoad: () => {
          const monaco = (window as any).monaco;
          if (monaco) {
            monaco.editor.defineTheme('drift', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'keyword', foreground: 'B8A9E8', fontStyle: 'bold' },
                { token: 'string', foreground: 'E8A9C0' },
                { token: 'number', foreground: 'E8CFA9' },
                { token: 'function', foreground: 'A9D8E8' },
                { token: 'type', foreground: 'A9E8C0' },
                { token: 'comment', foreground: '6B6488' },
                { token: 'operator', foreground: '9B93B4' },
                { token: 'delimiter', foreground: '9B93B4' },
                { token: 'delimiter.bracket', foreground: '9B93B4' },
                { token: 'identifier', foreground: 'EDE8F5' },
                { token: 'variable', foreground: 'EDE8F5' },
              ],
              colors: {
                'editor.background': '#0F0E1A',
                'editor.foreground': '#EDE8F5',
                'editorCursor.foreground': '#B8A9E8',
                'editor.selectionBackground': '#B8A9E826',
                'editor.lineHighlightBackground': '#B8A9E80A',
                'editorLineNumber.foreground': '#4A4468',
                'editorLineNumber.activeForeground': '#9B93B4',
                'editor.selectionHighlightBackground': '#B8A9E815',
                'editorBracketMatch.background': '#B8A9E826',
                'editorBracketMatch.border': '#B8A9E840',
              },
            });
          }
        },
      },
    },
  ],
  templateUrl: './boss-battle.component.html',
})
export class BossBattleComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private challengeService = inject(ChallengeService);
  private codeRunner = inject(CodeRunnerService);
  private progressService = inject(ProgressService);
  private driftState = inject(DriftStateService);
  private stackblitzRunner = inject(StackBlitzRunnerService);

  readonly icons = { Eye, Bug, Code, RefreshCw, Layers, CircleCheck, CircleX, Lightbulb, ChevronLeft, Play, Send, Loader, Clock };

  // Challenge state
  challenge = signal<Challenge | null>(null);
  private loadedDay = signal<Day | null>(null);
  isRunning = signal(false);
  executionResult = signal<ExecutionResult | null>(null);
  activeTab = signal<'console' | 'tests'>('tests');
  hintsRevealed = signal(0);
  showHints = signal(false);

  // Timer state
  timerSecondsLeft = signal(0);
  timerExpired = signal(false);
  showTimesUpMessage = signal(false);
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  // Multi-file state
  activeFileIndex = signal(0);
  fileContents = signal<string[]>([]);

  // Explain gate
  showExplainGate = signal(false);
  explanation = signal('');

  // StackBlitz
  sbProject = signal<StackBlitzProject | null>(null);

  // Completion
  showCompletion = signal(false);
  challengeCompleted = signal(false);
  earnedXp = signal(0);
  noHintBonusEarned = signal(false);
  speedBonusEarned = signal(false);

  // Tracking
  private startTime = 0;
  private attempts = 0;

  // --- Timer computed ---

  timerPercent = computed(() => {
    const c = this.challenge();
    if (!c?.timeLimitMinutes) return 100;
    return (this.timerSecondsLeft() / (c.timeLimitMinutes * 60)) * 100;
  });

  timerDisplay = computed(() => {
    const s = this.timerSecondsLeft();
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  });

  timerColorClass = computed(() => {
    if (this.timerExpired()) return 'text-drift-fail';
    const pct = this.timerPercent();
    if (pct > 50) return 'text-drift-gold';
    if (pct > 25) return 'text-drift-warning';
    return 'text-drift-fail';
  });

  timerPulsing = computed(() => !this.timerExpired() && this.timerPercent() <= 25);

  // --- Multi-file computed ---

  hasMultipleFiles = computed(() => (this.challenge()?.files?.length ?? 0) > 1);

  activeFile = computed(() => {
    const c = this.challenge();
    if (!c) return null;
    if (c.files?.length) return c.files[this.activeFileIndex()];
    return { name: 'script.js', content: c.starterCode, readOnly: false };
  });

  activeFileContent = computed(() => this.fileContents()[this.activeFileIndex()] ?? '');

  activeFileLanguage = computed(() => {
    const name = this.activeFile()?.name ?? 'script.js';
    if (name.endsWith('.ts')) return 'typescript';
    if (name.endsWith('.html')) return 'html';
    if (name.endsWith('.css') || name.endsWith('.scss')) return 'css';
    return 'javascript';
  });

  editorOptions = computed(() => ({
    theme: 'drift',
    language: this.activeFileLanguage(),
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    minimap: { enabled: false },
    wordWrap: 'on' as const,
    lineNumbers: 'on' as const,
    renderLineHighlight: 'line' as const,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: { top: 16, bottom: 16 },
    cursorBlinking: 'smooth' as const,
    cursorSmoothCaretAnimation: 'on' as const,
    smoothScrolling: true,
    tabSize: 2,
    readOnly: this.activeFile()?.readOnly ?? false,
    domReadOnly: this.activeFile()?.readOnly ?? false,
  }));

  // --- Type display ---

  typeIcon = computed(() => {
    switch (this.challenge()?.type) {
      case 'predict': return Eye;
      case 'debug': return Bug;
      case 'complete': return Code;
      case 'refactor': return RefreshCw;
      case 'build': return Layers;
      default: return Code;
    }
  });

  typeBadgeClass = computed(() => {
    switch (this.challenge()?.type) {
      case 'predict': return 'bg-drift-ice/12 text-drift-ice border-drift-ice/25';
      case 'debug': return 'bg-drift-fail/12 text-drift-fail border-drift-fail/25';
      case 'complete': return 'bg-drift-lavender/12 text-drift-lavender border-drift-lavender/25';
      case 'refactor': return 'bg-drift-gold/12 text-drift-gold border-drift-gold/25';
      case 'build': return 'bg-drift-sage/12 text-drift-sage border-drift-sage/25';
      default: return 'bg-drift-lavender/12 text-drift-lavender border-drift-lavender/25';
    }
  });

  testPassCount = computed(() => this.executionResult()?.testResults.filter(t => t.passed).length ?? 0);
  testTotalCount = computed(() => this.executionResult()?.testResults.length ?? this.challenge()?.tests?.length ?? 0);

  // --- Predict state (boss battles are always 'build', supported for completeness) ---
  selectedPrediction = signal<string | null>(null);
  predictionSubmitted = signal(false);
  predictionCorrect = signal(false);

  ngOnInit() {
    const dayNumber = Number(this.route.snapshot.paramMap.get('dayNumber')) || 1;

    this.challengeService.loadDay(dayNumber).subscribe({
      next: ({ day, challenges }) => {
        this.loadedDay.set(day);
        // Boss days have exactly one challenge — the capstone build
        const c = challenges[0];
        if (!c) {
          console.error(`No boss challenge found for day ${dayNumber}`);
          return;
        }

        this.challenge.set(c);

        // Initialize file contents from files array or single starterCode
        const contents = c.files?.length
          ? c.files.map(f => f.content)
          : [c.starterCode];
        this.fileContents.set(contents);

        this.startTime = Date.now();
        this.attempts = 0;

        if (c.timeLimitMinutes) {
          this.startTimer(c.timeLimitMinutes);
        }

        if (c.environment === 'stackblitz' && c.files?.length) {
          setTimeout(() => void this.initStackBlitz(), 0);
        }
      },
      error: (err) => console.error('Failed to load boss challenge:', err),
    });
  }

  ngOnDestroy() {
    this.clearTimer();
    this.sbProject()?.destroy();
  }

  private startTimer(minutes: number) {
    this.timerSecondsLeft.set(minutes * 60);
    this.timerInterval = setInterval(() => {
      if (this.timerSecondsLeft() <= 0) {
        this.timerExpired.set(true);
        this.showTimesUpMessage.set(true);
        this.clearTimer();
        return;
      }
      this.timerSecondsLeft.update(v => v - 1);
    }, 1000);
  }

  private clearTimer() {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  onCodeChange(value: string) {
    const contents = [...this.fileContents()];
    contents[this.activeFileIndex()] = value;
    this.fileContents.set(contents);
  }

  switchFile(index: number) {
    this.activeFileIndex.set(index);
  }

  async runCode() {
    this.isRunning.set(true);
    this.activeTab.set('console');
    const result = await this.codeRunner.execute(this.buildCombinedCode(), []);
    this.executionResult.set(result);
    this.isRunning.set(false);
  }

  async submitCode() {
    const c = this.challenge();
    if (!c) return;

    if (c.environment === 'stackblitz') {
      await this.submitStackBlitzCode(c);
      return;
    }

    this.isRunning.set(true);
    this.activeTab.set('tests');
    this.attempts++;
    const result = await this.codeRunner.execute(this.buildCombinedCode(), c.tests);
    this.executionResult.set(result);
    this.isRunning.set(false);

    if (result.status === 'pass') {
      if (c.explainGate && !this.challengeCompleted()) {
        this.showExplainGate.set(true);
      } else {
        this.completeChallenge();
      }
    }
  }

  private buildCombinedCode(): string {
    const c = this.challenge();
    if (!c?.files?.length) return this.fileContents()[0] ?? '';
    return c.files
      .map((file, i) => file.readOnly ? file.content : (this.fileContents()[i] ?? file.content))
      .join('\n\n');
  }

  private async submitStackBlitzCode(c: Challenge) {
    const proj = this.sbProject();
    if (!proj) return;

    this.isRunning.set(true);
    this.activeTab.set('tests');
    this.attempts++;

    const files = await this.stackblitzRunner.getEditableFiles(proj.vm, c.files ?? []);
    const combined = files.map(f => stripTypes(f.content)).join('\n\n');
    const result = await this.codeRunner.execute(combined, c.tests);
    this.executionResult.set(result);
    this.isRunning.set(false);

    if (result.status === 'pass') {
      if (c.explainGate && !this.challengeCompleted()) {
        this.showExplainGate.set(true);
      } else {
        this.completeChallenge();
      }
    }
  }

  private async initStackBlitz() {
    const c = this.challenge();
    if (!c?.files?.length) return;
    const el = document.getElementById('sb-container');
    if (!el) return;
    const project = await this.stackblitzRunner.embed(el, c.files);
    this.sbProject.set(project);
  }

  submitPrediction() {
    const c = this.challenge();
    if (!c || !this.selectedPrediction()) return;

    this.predictionSubmitted.set(true);
    this.predictionCorrect.set(this.selectedPrediction() === c.predictAnswer);

    if (this.predictionCorrect()) {
      if (c.explainGate && !this.challengeCompleted()) {
        setTimeout(() => this.showExplainGate.set(true), 800);
      } else {
        setTimeout(() => this.completeChallenge(), 800);
      }
    }
  }

  acknowledgeWrongPrediction() {
    const c = this.challenge();
    if (!c) return;
    if (c.explainGate && !this.challengeCompleted()) {
      this.showExplainGate.set(true);
    } else {
      this.completeChallenge();
    }
  }

  submitExplanation() {
    const c = this.challenge();
    if (!c?.explainGate) return;
    if (this.explanation().length < c.explainGate.minLength) return;
    this.showExplainGate.set(false);
    this.completeChallenge();
  }

  revealHint() {
    const c = this.challenge();
    if (!c) return;
    if (this.hintsRevealed() < c.hints.length) {
      this.hintsRevealed.update(v => v + 1);
    }
  }

  goBack() {
    const c = this.challenge();
    this.router.navigate(c ? ['/day', c.dayNumber] : ['/']);
  }

  // Boss is always the day's only challenge — always proceeds to day complete
  continueAction() {
    const c = this.challenge();
    if (!c) return;
    this.router.navigate(['/day', c.dayNumber, 'complete']);
  }

  private completeChallenge() {
    const c = this.challenge();
    if (!c || this.challengeCompleted()) return;

    playBloom(true);
    this.challengeCompleted.set(true);
    this.clearTimer();

    const timeSpentMs = Date.now() - this.startTime;
    const firstTry = c.type === 'predict'
      ? this.predictionCorrect()
      : this.attempts <= 1;
    const hintsUsed = this.hintsRevealed();

    let xp = c.xpReward;
    const noHint = hintsUsed === 0;
    // Speed bonus: only available if the timer hasn't expired
    const speedEarned = !this.timerExpired()
      && !!c.bonusXp?.speedThresholdMs
      && timeSpentMs < c.bonusXp.speedThresholdMs;

    if (c.bonusXp) {
      if (noHint) xp += c.bonusXp.noHints;
      if (firstTry) xp += c.bonusXp.firstTry;
      if (speedEarned) xp += c.bonusXp.speedBonus;
    }

    this.noHintBonusEarned.set(noHint && (c.bonusXp?.noHints ?? 0) > 0);
    this.speedBonusEarned.set(speedEarned);
    this.earnedXp.set(xp);

    this.progressService.addXp(xp);
    this.progressService.completeChallenge(c.dayNumber, c.id, {
      xpEarned: xp,
      hintsUsed,
      attempts: this.attempts,
      timeSpentMs,
      firstTry,
      title: c.title,
      codeSnapshot: this.buildCombinedCode(),
      explanation: this.explanation() || undefined,
    });
    // Boss days have exactly 1 challenge
    this.progressService.completeDay(c.dayNumber, 1);
    this.driftState.triggerUnlock(c.dayNumber, true, this.loadedDay()?.driftUnlocks);

    this.showCompletion.set(true);
  }
}
