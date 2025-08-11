import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, Language } from '../../services/translation.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-selector">
      <div class="dropdown" (click)="toggleDropdown()">
        <button class="btn btn-outline-primary dropdown-toggle" type="button">
          <span class="flag">{{ currentLanguage?.flag }}</span>
          <span class="language-name">{{ currentLanguage?.nativeName }}</span>
          <i class="fas fa-chevron-down ms-2"></i>
        </button>
        
        <div class="dropdown-menu" [class.show]="isOpen">
          <div class="dropdown-header">
            <i class="fas fa-globe me-2"></i>
            {{ translate('common.select_language') }}
          </div>
          
          <div class="dropdown-divider"></div>
          
          <button 
            *ngFor="let language of supportedLanguages"
            class="dropdown-item"
            [class.active]="language.code === currentLanguage?.code"
            (click)="selectLanguage(language.code)">
            <span class="flag">{{ language.flag }}</span>
            <span class="language-name">{{ language.nativeName }}</span>
            <span class="language-english">({{ language.name }})</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .language-selector {
      position: relative;
    }
    
    .dropdown {
      position: relative;
    }
    
    .dropdown-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: 1px solid var(--primary);
      border-radius: 8px;
      background: white;
      color: var(--primary);
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .dropdown-toggle:hover {
      background: var(--primary-light);
      transform: translateY(-1px);
    }
    
    .flag {
      font-size: 1.2rem;
    }
    
    .language-name {
      font-weight: 600;
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      min-width: 200px;
      background: white;
      border: 1px solid var(--gray-300);
      border-radius: 8px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    }
    
    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .dropdown-header {
      padding: 12px 16px;
      font-weight: 600;
      color: var(--gray-700);
      border-bottom: 1px solid var(--gray-200);
      font-size: 0.9rem;
    }
    
    .dropdown-divider {
      height: 1px;
      background: var(--gray-200);
      margin: 4px 0;
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 0;
    }
    
    .dropdown-item:hover {
      background: var(--primary-light);
      color: var(--primary);
    }
    
    .dropdown-item.active {
      background: var(--primary);
      color: white;
    }
    
    .dropdown-item .flag {
      font-size: 1.1rem;
    }
    
    .dropdown-item .language-name {
      font-weight: 500;
      flex: 1;
    }
    
    .dropdown-item .language-english {
      font-size: 0.8rem;
      opacity: 0.7;
    }
    
    @media (max-width: 768px) {
      .dropdown-toggle {
        padding: 6px 12px;
        font-size: 0.9rem;
      }
      
      .dropdown-menu {
        min-width: 180px;
      }
      
      .dropdown-item {
        padding: 10px 12px;
      }
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  isOpen = false;
  currentLanguage?: Language;
  supportedLanguages: Language[] = [];

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.supportedLanguages = this.translationService.getSupportedLanguages();
    this.currentLanguage = this.translationService.getCurrentLanguageInfo();
    
    // Subscribe to language changes
    this.translationService.currentLanguage$.subscribe(() => {
      this.currentLanguage = this.translationService.getCurrentLanguageInfo();
    });
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectLanguage(languageCode: string) {
    this.translationService.setLanguage(languageCode);
    this.isOpen = false;
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
