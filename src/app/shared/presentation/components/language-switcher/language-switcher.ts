import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.html',
  styleUrls: ['./language-switcher.css']
})
export class LanguageSwitcher {
  translate = inject(TranslateService);

  get currentLang() {
    return this.translate.currentLang || this.translate.defaultLang;
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
  }
}
