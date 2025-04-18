/**
 * Focus trap utility for modals, dialogs, and other UI elements that need to trap focus
 * 
 * This utility helps ensure keyboard navigation accessibility by:
 * 1. Trapping focus within a container when it's active
 * 2. Restoring focus to the previously focused element when the container is closed
 * 3. Setting initial focus to the first focusable element in the container
 */

// Selector for all focusable elements
const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export class FocusTrap {
  private container: HTMLElement;
  private previouslyFocusedElement: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];
  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;
  private active: boolean = false;
  private handleKeyDown: (event: KeyboardEvent) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.handleKeyDown = this.onKeyDown.bind(this);
  }

  /**
   * Activate the focus trap
   */
  activate(): void {
    if (this.active) return;

    // Store the currently focused element to restore later
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    // Find all focusable elements within the container
    this.updateFocusableElements();

    // Set up event listeners
    document.addEventListener('keydown', this.handleKeyDown);

    // Set focus to the first focusable element
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }

    this.active = true;
  }

  /**
   * Deactivate the focus trap
   */
  deactivate(): void {
    if (!this.active) return;

    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeyDown);

    // Restore focus to the previously focused element
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }

    this.active = false;
  }

  /**
   * Update the list of focusable elements within the container
   */
  updateFocusableElements(): void {
    const elements = Array.from(
      this.container.querySelectorAll(FOCUSABLE_ELEMENTS)
    ) as HTMLElement[];

    this.focusableElements = elements;
    this.firstFocusableElement = elements[0] || null;
    this.lastFocusableElement = elements[elements.length - 1] || null;
  }

  /**
   * Handle keydown events to trap focus within the container
   */
  private onKeyDown(event: KeyboardEvent): void {
    // Only handle Tab key
    if (event.key !== 'Tab') return;

    // If Shift+Tab is pressed and focus is on the first element, move to the last element
    if (event.shiftKey && document.activeElement === this.firstFocusableElement) {
      event.preventDefault();
      this.lastFocusableElement?.focus();
    }
    // If Tab is pressed and focus is on the last element, move to the first element
    else if (!event.shiftKey && document.activeElement === this.lastFocusableElement) {
      event.preventDefault();
      this.firstFocusableElement?.focus();
    }
  }
}

/**
 * Create a focus trap for a container element
 */
export function createFocusTrap(container: HTMLElement): FocusTrap {
  return new FocusTrap(container);
}
