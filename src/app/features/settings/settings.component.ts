import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressService } from '../../core/services/progress.service';
import { LucideAngularModule, ChevronLeft, Download, Upload, Trash2, Calendar, Volume2, Unlock } from 'lucide-angular';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  private router = inject(Router);
  private progressService = inject(ProgressService);

  readonly icons = { ChevronLeft, Download, Upload, Trash2, Calendar, Volume2, Unlock };

  devUnlockDone = signal(false);

  startDate = signal(this.progressService.getStartDate());
  calendarLock = signal(this.progressService.getProgress().settings.calendarLock);
  soundVolume = signal(this.progressService.getProgress().settings.soundVolume);
  showResetConfirm = signal(false);
  importError = signal('');
  importSuccess = signal(false);

  goHome(): void {
    this.router.navigate(['/']);
  }

  onStartDateChange(value: string): void {
    this.startDate.set(value);
    this.progressService.setStartDate(value);
  }

  onCalendarLockChange(value: boolean): void {
    this.calendarLock.set(value);
    this.progressService.updateSettings({ calendarLock: value });
  }

  onVolumeChange(value: number): void {
    this.soundVolume.set(value);
    this.progressService.updateSettings({ soundVolume: value });
  }

  exportProgress(): void {
    const json = this.progressService.exportProgress();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '26days-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  triggerImport(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const success = this.progressService.importProgress(reader.result as string);
        if (success) {
          this.importSuccess.set(true);
          this.importError.set('');
          setTimeout(() => this.importSuccess.set(false), 3000);
        } else {
          this.importError.set('Invalid progress file');
          setTimeout(() => this.importError.set(''), 3000);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  devUnlockAll(): void {
    this.progressService.devUnlockAll();
    this.devUnlockDone.set(true);
  }

  confirmReset(): void {
    this.progressService.resetAll();
    this.showResetConfirm.set(false);
    this.router.navigate(['/onboarding']);
  }
}
