import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Challenge, Day, ExecutionResult } from '../../core/models/challenge.model';
import { ChallengeService } from '../../core/services/challenge.service';
import { CodeRunnerService } from '../../core/services/code-runner.service';
import { ProgressService } from '../../core/services/progress.service';
import { DriftStateService } from '../../core/services/drift-state.service';
import { StackBlitzRunnerService, StackBlitzProject } from '../../core/services/stackblitz-runner.service';
import { stripTypes } from '../../core/utils/ts-strip.util';
import { EditorComponent, NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { LucideAngularModule, Eye, Bug, Code, RefreshCw, Layers, CircleCheck, CircleX, Lightbulb, ChevronLeft, Play, Send, Loader } from 'lucide-angular';
import { playBloom } from '../../core/utils/gsap-effects.util';
import { AudioService } from '../../core/services/audio.service';

@Component({
  selector: 'app-challenge',
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
  templateUrl: './challenge.component.html',
})
export class ChallengeComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private challengeService = inject(ChallengeService);
  private codeRunner = inject(CodeRunnerService);
  private progressService = inject(ProgressService);
  private driftState = inject(DriftStateService);
  private stackblitzRunner = inject(StackBlitzRunnerService);
  private audio = inject(AudioService);

  // Icons
  readonly icons = { Eye, Bug, Code, RefreshCw, Layers, CircleCheck, CircleX, Lightbulb, ChevronLeft, Play, Send, Loader };

  // State
  challenge = signal<Challenge | null>(null);
  code = signal('');
  isRunning = signal(false);
  executionResult = signal<ExecutionResult | null>(null);
  activeTab = signal<'console' | 'tests'>('tests');
  hintsRevealed = signal(0);
  showHints = signal(false);

  // Predict mode state
  selectedPrediction = signal<string | null>(null);
  predictionSubmitted = signal(false);
  predictionCorrect = signal(false);

  // Explain gate state
  showExplainGate = signal(false);
  explanation = signal('');

  // StackBlitz state
  sbProject = signal<StackBlitzProject | null>(null);

  // Completion state
  showCompletion = signal(false);
  challengeCompleted = signal(false);
  passCelebrationActive = signal(false);
  displayedXp = signal(0);

  // Day-level data for navigation
  private challengeIds = signal<string[]>([]);
  private totalChallenges = signal(0);
  private loadedDay = signal<Day | null>(null);
  dayCompleted = signal(false);

  // Tracking
  private startTime = 0;
  private attempts = 0;
  earnedXp = signal(0);
  private routeSub!: Subscription;

  // Navigation computed
  nextChallengeId = computed(() => {
    const c = this.challenge();
    const ids = this.challengeIds();
    if (!c || ids.length === 0) return null;
    const currentIndex = ids.indexOf(c.id);
    if (currentIndex < 0 || currentIndex >= ids.length - 1) return null;
    return ids[currentIndex + 1];
  });

  isLastChallenge = computed(() => {
    const c = this.challenge();
    const ids = this.challengeIds();
    if (!c || ids.length === 0) return false;
    return ids.indexOf(c.id) === ids.length - 1;
  });

  continueButtonText = computed(() => {
    if (this.dayCompleted()) return 'Complete Day';
    if (this.nextChallengeId()) return 'Next Mission';
    return 'Continue';
  });

  // Computed
  typeIcon = computed(() => {
    const t = this.challenge()?.type;
    switch (t) {
      case 'predict': return Eye;
      case 'debug': return Bug;
      case 'complete': return Code;
      case 'refactor': return RefreshCw;
      case 'build': return Layers;
      default: return Code;
    }
  });

  typeBadgeClass = computed(() => {
    const t = this.challenge()?.type;
    switch (t) {
      case 'predict': return 'bg-drift-ice/12 text-drift-ice border-drift-ice/25 shadow-drift-glow-ice/20';
      case 'debug': return 'bg-drift-fail/12 text-drift-fail border-drift-fail/25 shadow-drift-glow-fail/20';
      case 'complete': return 'bg-drift-lavender/12 text-drift-lavender border-drift-lavender/25 shadow-drift-glow-lavender/20';
      case 'refactor': return 'bg-drift-gold/12 text-drift-gold border-drift-gold/25 shadow-drift-glow-gold/20';
      case 'build': return 'bg-drift-sage/12 text-drift-sage border-drift-sage/25 shadow-drift-glow-sage/20';
      default: return 'bg-drift-lavender/12 text-drift-lavender border-drift-lavender/25 shadow-drift-glow-lavender/20';
    }
  });

  typeBadgeGlow = computed(() => {
    const t = this.challenge()?.type;
    switch (t) {
      case 'predict': return 'rgba(169, 216, 232, 0.15)';
      case 'debug': return 'rgba(232, 125, 138, 0.15)';
      case 'complete': return 'rgba(184, 169, 232, 0.15)';
      case 'refactor': return 'rgba(232, 207, 169, 0.15)';
      case 'build': return 'rgba(169, 232, 192, 0.15)';
      default: return 'rgba(184, 169, 232, 0.15)';
    }
  });

  editorStatusColor = computed(() => {
    if (this.passCelebrationActive()) return 'bg-drift-sage shadow-[0_0_8px_rgba(169,232,192,0.8)]';
    if (this.isRunning()) return 'bg-drift-gold animate-pulse shadow-[0_0_8px_rgba(232,207,169,0.8)]';
    return 'bg-drift-lavender shadow-[0_0_8px_rgba(184,169,232,0.6)]';
  });

  testPassCount = computed(() => {
    const r = this.executionResult();
    if (!r) return 0;
    return r.testResults.filter((t) => t.passed).length;
  });

  testTotalCount = computed(() => {
    const r = this.executionResult();
    if (!r) return this.challenge()?.tests?.length ?? 0;
    return r.testResults.length;
  });

  private readonly baseEditorOptions = {
    theme: 'drift',
    language: 'javascript',
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
  };

  editorOptions = { ...this.baseEditorOptions };
  readOnlyEditorOptions = { ...this.baseEditorOptions, readOnly: true, domReadOnly: true };

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const dayNumber = Number(params.get('dayNumber')) || 1;
      const challengeId = params.get('challengeId') || 'd01-c01';

      // Reset state for the new challenge
      this.resetChallengeState();

      this.challengeService.loadDay(dayNumber).subscribe({
        next: ({ day, challenges }) => {
          this.loadedDay.set(day);
          this.challengeIds.set(day.challengeIds);
          this.totalChallenges.set(challenges.length);

          const c = challenges.find((ch) => ch.id === challengeId);
          if (!c) {
            console.error(`Challenge ${challengeId} not found`);
            return;
          }
          this.challenge.set(c);
          this.code.set(c.starterCode);
          this.startTime = Date.now();
          this.attempts = 0;

          const lang = c.language ?? this.inferEditorLanguage(c);
          this.editorOptions = { ...this.baseEditorOptions, language: lang };
          this.readOnlyEditorOptions = { ...this.baseEditorOptions, language: lang, readOnly: true, domReadOnly: true };

          if (c.environment === 'stackblitz' && c.files?.length) {
            // setTimeout(0) lets Angular finish rendering the #sb-container div
            setTimeout(() => void this.initStackBlitz(), 0);
          }
        },
        error: (err) => console.error('Failed to load challenge:', err),
      });
    });
  }

  private resetChallengeState() {
    // Destroy previous StackBlitz instance if any
    this.sbProject()?.destroy();
    this.sbProject.set(null);

    // Reset all challenge-specific state
    this.challenge.set(null);
    this.code.set('');
    this.executionResult.set(null);
    this.activeTab.set('tests');
    this.hintsRevealed.set(0);
    this.showHints.set(false);
    this.selectedPrediction.set(null);
    this.predictionSubmitted.set(false);
    this.predictionCorrect.set(false);
    this.showExplainGate.set(false);
    this.explanation.set('');
    this.showCompletion.set(false);
    this.challengeCompleted.set(false);
    this.passCelebrationActive.set(false);
    this.displayedXp.set(0);
    this.earnedXp.set(0);
    this.dayCompleted.set(false);
  }

  onCodeChange(value: string) {
    this.code.set(value);
  }

  async runCode() {
    this.isRunning.set(true);
    this.activeTab.set('console');
    const result = await this.codeRunner.execute(this.code(), []);
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
    const result = await this.codeRunner.execute(this.code(), c.tests);
    this.executionResult.set(result);
    this.isRunning.set(false);

    if (result.status === 'pass') {
      this.passCelebrationActive.set(true);
      setTimeout(() => {
        if (c.explainGate && !this.challengeCompleted()) {
          this.showExplainGate.set(true);
        } else {
          this.completeChallenge();
        }
      }, 1000);
    }
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
      this.passCelebrationActive.set(true);
      setTimeout(() => {
        if (c.explainGate && !this.challengeCompleted()) {
          this.showExplainGate.set(true);
        } else {
          this.completeChallenge();
        }
      }, 1000);
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

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.sbProject()?.destroy();
  }

  submitPrediction() {
    const c = this.challenge();
    if (!c || !this.selectedPrediction()) return;

    this.predictionSubmitted.set(true);
    this.predictionCorrect.set(this.selectedPrediction() === c.predictAnswer);

    if (this.predictionCorrect()) {
      this.passCelebrationActive.set(true);
      setTimeout(() => {
        if (c.explainGate && !this.challengeCompleted()) {
          this.showExplainGate.set(true);
        } else {
          this.completeChallenge();
        }
      }, 1000);
    }
    // Wrong prediction: user will click "I Understand" button to proceed
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
      this.hintsRevealed.update((v) => v + 1);
    }
  }

  goBack(): void {
    const c = this.challenge();
    if (c) {
      this.router.navigate(['/day', c.dayNumber]);
    } else {
      this.router.navigate(['/']);
    }
  }

  continueAction(): void {
    const c = this.challenge();
    if (!c) return;

    if (this.dayCompleted()) {
      this.router.navigate(['/day', c.dayNumber, 'complete']);
    } else if (this.nextChallengeId()) {
      this.router.navigate(['/day', c.dayNumber, 'challenge', this.nextChallengeId()]);
    } else {
      this.router.navigate(['/day', c.dayNumber]);
    }
  }

  private inferEditorLanguage(c: { dayNumber: number; concepts: string[] }): string {
    if (c.dayNumber >= 12 && c.dayNumber <= 14) return 'typescript';
    if (c.concepts.some(concept => concept.toLowerCase().includes('typescript'))) return 'typescript';
    return 'javascript';
  }

  private completeChallenge() {
    const c = this.challenge();
    if (!c || this.challengeCompleted()) return;

    playBloom();
    this.audio.playSuccess();
    this.challengeCompleted.set(true);

    const timeSpentMs = Date.now() - this.startTime;
    const firstTry = c.type === 'predict'
      ? this.predictionCorrect()
      : this.attempts <= 1;
    const hintsUsed = this.hintsRevealed();

    let xp = c.xpReward;
    if (c.bonusXp) {
      if (hintsUsed === 0) xp += c.bonusXp.noHints;
      if (firstTry) xp += c.bonusXp.firstTry;
      if (c.bonusXp.speedThresholdMs && timeSpentMs < c.bonusXp.speedThresholdMs) {
        xp += c.bonusXp.speedBonus;
      }
    }

    this.earnedXp.set(xp);
    this.progressService.addXp(xp);
    this.progressService.completeChallenge(c.dayNumber, c.id, {
      xpEarned: xp,
      hintsUsed,
      attempts: this.attempts,
      timeSpentMs,
      firstTry,
      title: c.title,
      codeSnapshot: c.type !== 'predict' ? this.code() : undefined,
      explanation: this.explanation() || undefined,
    });

    // Check if this completes the day
    const completed = this.progressService.completeDay(c.dayNumber, this.totalChallenges());
    this.dayCompleted.set(completed);
    if (completed) {
      this.driftState.triggerUnlock(c.dayNumber, false, this.loadedDay()?.driftUnlocks);
    }

    this.showCompletion.set(true);
    
    // Animate XP
    const interval = setInterval(() => {
      this.displayedXp.update(val => {
        if (val >= xp) {
          clearInterval(interval);
          return xp;
        }
        return val + Math.ceil(xp / 20); // Reach target in 20 steps
      });
    }, 40);
  }
}
