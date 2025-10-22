import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ab-testing-panel',
  imports: [CommonModule],
  templateUrl: './ab-testing-panel.html',
  styleUrl: './ab-testing-panel.css'
})
export class AbTestingPanel implements OnInit, OnDestroy {
  
  experiments: any[] = [];
  currentExperiment: any = null;
  userVariant: string = '';
  experimentResults: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  private subscriptions: Subscription = new Subscription();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadExperiments();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async loadExperiments(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';

      const response = await this.apiService.getExperiments().toPromise();
      if (response && response.success && response.data) {
        this.experiments = response.data;
        if (this.experiments.length > 0) {
          this.currentExperiment = this.experiments[0];
          this.getUserAssignment();
        }
      } else {
        this.errorMessage = 'Failed to load experiments';
      }
    } catch (error) {
      console.error('Error loading experiments:', error);
      this.errorMessage = 'Error loading experiments';
    } finally {
      this.isLoading = false;
    }
  }

  async getUserAssignment(): Promise<void> {
    if (!this.currentExperiment) return;

    try {
      const response = await this.apiService.assignToExperiment(this.currentExperiment.name).toPromise();
      if (response && response.success) {
        this.userVariant = response.variant;
        console.log(`User assigned to variant: ${this.userVariant}`);
      }
    } catch (error) {
      console.error('Error getting user assignment:', error);
    }
  }

  async trackEvent(eventType: string, eventData?: any): Promise<void> {
    if (!this.currentExperiment) return;

    try {
      const response = await this.apiService.trackEvent(
        this.currentExperiment.name,
        eventType,
        eventData
      ).toPromise();
      
      if (response && response.success) {
        console.log(`Event tracked: ${eventType}`);
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  async loadExperimentResults(): Promise<void> {
    if (!this.currentExperiment) return;

    try {
      this.isLoading = true;
      this.errorMessage = '';

      const response = await this.apiService.getExperimentResults(this.currentExperiment.name).toPromise();
      if (response && response.success) {
        this.experimentResults = response.results;
      } else {
        this.errorMessage = 'Failed to load experiment results';
      }
    } catch (error) {
      console.error('Error loading experiment results:', error);
      this.errorMessage = 'Error loading experiment results';
    } finally {
      this.isLoading = false;
    }
  }

  getVariantColor(variant: string): string {
    switch (variant.toLowerCase()) {
      case 'openai':
        return '#10a37f';
      case 'google':
        return '#4285f4';
      default:
        return '#6c757d';
    }
  }

  getVariantIcon(variant: string): string {
    switch (variant.toLowerCase()) {
      case 'openai':
        return '🤖';
      case 'google':
        return '🔍';
      default:
        return '❓';
    }
  }
}
