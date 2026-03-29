import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressService } from '../../core/services/progress.service';
import { LucideAngularModule, ArrowRight, Calendar } from 'lucide-angular';

export enum OnboardingPhase {
  Void = 0,
  FirstLight = 1,
  TextCadence = 2,
  Setup = 3
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './onboarding.component.html',
})
export class OnboardingComponent implements OnInit {
  private router = inject(Router);
  private progressService = inject(ProgressService);

  readonly icons = { ArrowRight, Calendar };
  startDate = signal<string>(this.getDefaultDate());

  phase = signal<OnboardingPhase>(OnboardingPhase.Void);
  
  sentences = [
    "The Drift.",
    "26 days to transform your understanding.",
    "A journey through JavaScript, guided by narrative and challenge.",
    "Each day builds on the last.",
    "Each concept connects to the next."
  ];
  displayedSentences = signal<string[][]>([]); // Array of lines, each is an array of words
  pulseActive = signal(false);
  showBeginButton = signal(false);

  private getDefaultDate(): string {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }

  ngOnInit() {
    // 1. The Void -> The First Light (after 1s)
    setTimeout(() => {
      this.phase.set(OnboardingPhase.FirstLight);
      // 2. Text Cadence (after 2s)
      setTimeout(() => {
        this.phase.set(OnboardingPhase.TextCadence);
        this.startTextCadence();
      }, 2000);
    }, 1000);
  }

  async startTextCadence() {
    for (let sIdx = 0; sIdx < this.sentences.length; sIdx++) {
      // Pulse light
      this.pulseActive.set(true);
      setTimeout(() => this.pulseActive.set(false), 1000);
      
      const words = this.sentences[sIdx].split(' ');
      this.displayedSentences.update(curr => [...curr, []]);
      
      for (let wIdx = 0; wIdx < words.length; wIdx++) {
        await new Promise(r => setTimeout(r, 60));
        this.displayedSentences.update(curr => {
          const newArr = [...curr];
          newArr[sIdx] = [...newArr[sIdx], words[wIdx]];
          return newArr;
        });
      }
      
      if (sIdx < this.sentences.length - 1) {
        await new Promise(r => setTimeout(r, 2500)); // 2.5s pause
      }
    }
    
    // Show button
    setTimeout(() => this.showBeginButton.set(true), 1000);
  }

  nextStep(): void {
    this.phase.set(OnboardingPhase.Setup);
  }

  begin(): void {
    this.progressService.setStartDate(this.startDate());
    this.router.navigate(['/']);
  }

  onDateChange(value: string): void {
    this.startDate.set(value);
  }
}
