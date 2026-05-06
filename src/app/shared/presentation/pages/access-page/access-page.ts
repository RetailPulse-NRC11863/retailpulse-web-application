import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {LanguageSwitcher} from '../../components/language-switcher/language-switcher';

@Component({
  selector: 'app-access-page',
  imports: [RouterLink, TranslateModule, LanguageSwitcher],
  templateUrl: './access-page.html',
  styleUrl: './access-page.css',
})
export class AccessPage {}
