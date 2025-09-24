import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CommonServices {

    constructor() { }

    //reload the page
    reloadPageAfter(delay: number = 500): void {
        setTimeout(() => {
            window.location.reload();
        }, delay);
    }

    // Format date to display
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }


}
