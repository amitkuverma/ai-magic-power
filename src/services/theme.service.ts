import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private isDarkMode = false;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
    }
  }

  setLightTheme() {
    this.renderer.removeClass(document.documentElement, 'dark');
    this.isDarkMode = false;
  }

  setDarkTheme() {
    this.renderer.addClass(document.documentElement, 'dark');
    this.isDarkMode = true;
  }

  isDarkModeEnabled(): boolean {
    return this.isDarkMode;
  }
}
