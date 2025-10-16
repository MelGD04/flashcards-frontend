import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class ThemeService{
    private renderer: Renderer2;
    private isLightTheme = new BehaviorSubject<boolean>(true); 

    constructor(@Inject(PLATFORM_ID) private platformId: Object, rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);

        if (isPlatformBrowser(this.platformId)) {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                this.setDarkTheme();
            } else {
                this.setLightTheme();
            }
        }
    }

    getTheme() {
        return this.isLightTheme.asObservable();
    }

    toggleTheme() {
        if (this.isLightTheme.value) {
            this.setDarkTheme();
        } else {
            this.setLightTheme();
        }
    }

    setLightTheme() {
        this.renderer.removeClass(document.body, 'dark-theme');
        this.renderer.addClass(document.body, 'light-theme');
        this.isLightTheme.next(true); // Actualiza el estado del tema
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('theme', 'light');
        }
    }

    setDarkTheme() {
        this.renderer.removeClass(document.body, 'light-theme');
        this.renderer.addClass(document.body, 'dark-theme');
        this.isLightTheme.next(false); // Actualiza el estado del tema
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('theme', 'dark');
        }
    }
}