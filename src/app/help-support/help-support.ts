import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-help-support',
  imports: [],
  templateUrl: './help-support.html',
  styleUrl: './help-support.css'
})
export class HelpSupport implements OnInit, OnDestroy {
  @Input() isHelpActive: boolean = false;
  @Output() isHelpActiveChange = new EventEmitter<boolean>();

  activeTab: string = 'student';
  faqStates: { [key: string]: boolean } = {};

  constructor() {
    // Initialize all FAQ states as closed
    this.initializeFaqStates();
  }

  ngOnInit(): void {
    // Add event listener for escape key
    document.addEventListener('keydown', this.handleEscapeKey.bind(this));
  }

  ngOnDestroy(): void {
    // Clean up event listener
    document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
  }

  private initializeFaqStates(): void {
    // Student FAQ states
    for (let i = 1; i <= 11; i++) {
      this.faqStates[`student-${i}`] = false;
    }
    
    // Trainer FAQ states
    for (let i = 1; i <= 11; i++) {
      this.faqStates[`trainer-${i}`] = false;
    }
    
    // General FAQ states
    for (let i = 1; i <= 7; i++) {
      this.faqStates[`general-${i}`] = false;
    }
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(event?: KeyboardEvent): void {
    if (this.isHelpActive && (event?.key === 'Escape' || !event)) {
      this.closeModal();
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    // Close all FAQs when switching tabs
    this.closeFaqs();
  }

  toggleFaq(event: Event): void {
    const faqItem = (event.target as HTMLElement).closest('.faq-item');
    if (!faqItem) return;

    const faqId = this.getFaqId(faqItem);
    if (faqId) {
      this.faqStates[faqId] = !this.faqStates[faqId];
    }

    // Toggle active class
    faqItem.classList.toggle('active');
  }

  private getFaqId(faqItem: Element): string | null {
    const parentCategory = faqItem.closest('.faq-category');
    if (!parentCategory) return null;

    const categoryTitle = parentCategory.querySelector('.category-title')?.textContent?.trim();
    const faqQuestion = faqItem.querySelector('.faq-question')?.textContent?.trim();
    
    if (!categoryTitle || !faqQuestion) return null;

    // Generate unique ID based on tab, category, and question
    const tabPrefix = this.activeTab;
    const categoryMap: { [key: string]: string } = {
      'Getting Started': '1',
      'Booking Sessions': '2', 
      'Managing Bookings': '3',
      'Technical Issues': '4',
      'Becoming a Trainer': '1',
      'Creating Sessions': '2',
      'Managing Sessions': '3', 
      'Best Practices': '4',
      'Account Management': '1',
      'Platform Features': '2',
      'Online Support': '3'
    };

    const categoryNum = categoryMap[categoryTitle] || '1';
    const faqIndex = this.getFaqIndex(faqItem);
    
    return `${tabPrefix}-${categoryNum}${faqIndex}`;
  }

  private getFaqIndex(faqItem: Element): number {
    const siblings = Array.from(faqItem.parentElement?.children || []);
    return siblings.indexOf(faqItem) + 1;
  }

  closeModal(event?: Event): void {
    // If event is provided, check if it's the overlay click
    if (event && (event.target as HTMLElement).classList.contains('modal-content')) {
      return; // Don't close if clicking inside modal content
    }

    this.isHelpActive = false;
    this.isHelpActiveChange.emit(false);
    this.closeFaqs();
  }

  private closeFaqs(): void {
    // Reset all FAQ states
    Object.keys(this.faqStates).forEach(key => {
      this.faqStates[key] = false;
    });

    // Remove active classes from DOM elements
    setTimeout(() => {
      const activeFaqs = document.querySelectorAll('.faq-item.active');
      activeFaqs.forEach(faq => faq.classList.remove('active'));
    }, 0);
  }

  // Prevent modal from closing when clicking inside the modal content
  onModalContentClick(event: Event): void {
    event.stopPropagation();
  }

  // Handle tab changes with proper type safety
  onTabChange(tab: 'student' | 'trainer' | 'general'): void {
    this.setActiveTab(tab);
  }

  // Check if current tab is active
  isTabActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  // Get FAQ state safely
  getFaqState(faqId: string): boolean {
    return this.faqStates[faqId] || false;
  }
}