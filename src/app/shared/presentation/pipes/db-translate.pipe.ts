import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dbTranslate',
  standalone: true,
  pure: false // Impure so it reacts immediately to language changes
})
export class DbTranslatePipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(value: string | null | undefined, prefix: string = 'db.'): string | any {
    if (!value) return value;
    
    // Convert value to key format
    const key = `${prefix}${value}`;
    const translation = this.translate.instant(key);
    
    // If ngx-translate returns the exact key requested, it means no translation was found.
    // In that case, we gracefully fallback to the original database string.
    if (translation === key) {
        return value;
    }
    
    return translation;
  }
}
