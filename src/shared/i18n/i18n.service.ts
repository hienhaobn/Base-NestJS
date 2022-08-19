import { Injectable, OnModuleInit } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import { deepPick } from '../utils/object.helper';

@Injectable()
export class I18nService implements OnModuleInit {
  languages: any;

  async onModuleInit(): Promise<void> {
    await this.loadLanguages();
  }

  private async loadLanguages(): Promise<any> {
    return new Promise((resolve) => {
      const languages = {};
      const files = fs.readdirSync(path.join(process.cwd(), 'dist/i18n/'));
      files.forEach((file) => {
        const lang = file.split('.')[0];
        languages[lang] = require(path.join(process.cwd(), 'dist/i18n/', file));
      });
      this.languages = languages;
      resolve(true);
    }).catch((e) => {
      console.error('error loading language files', e);
    });
  }

  private getLanguage(lang: string, fallback = 'en'): any {
    return lang in this.languages
      ? this.languages[lang]
      : this.languages[fallback];
  }

  public translate(lang: string, key: string, fallback = 'en'): string {
    const language = this.getLanguage(lang, fallback);
    return deepPick(language, key) || key;
  }
}
