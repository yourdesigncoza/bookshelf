/**
 * Keyboard navigation utility for handling keyboard shortcuts and navigation
 * 
 * This utility helps improve keyboard accessibility by:
 * 1. Providing a consistent way to handle keyboard shortcuts
 * 2. Supporting common keyboard patterns like arrow key navigation
 * 3. Allowing for custom keyboard shortcuts
 */

export type KeyboardShortcut = {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
};

export class KeyboardNavigation {
  private shortcuts: KeyboardShortcut[] = [];
  private active: boolean = false;
  private handleKeyDown: (event: KeyboardEvent) => void;

  constructor() {
    this.handleKeyDown = this.onKeyDown.bind(this);
  }

  /**
   * Add a keyboard shortcut
   */
  addShortcut(shortcut: KeyboardShortcut): void {
    this.shortcuts.push(shortcut);
  }

  /**
   * Remove a keyboard shortcut
   */
  removeShortcut(key: string): void {
    this.shortcuts = this.shortcuts.filter(shortcut => shortcut.key !== key);
  }

  /**
   * Activate keyboard navigation
   */
  activate(): void {
    if (this.active) return;
    document.addEventListener('keydown', this.handleKeyDown);
    this.active = true;
  }

  /**
   * Deactivate keyboard navigation
   */
  deactivate(): void {
    if (!this.active) return;
    document.removeEventListener('keydown', this.handleKeyDown);
    this.active = false;
  }

  /**
   * Handle keydown events
   */
  private onKeyDown(event: KeyboardEvent): void {
    // Don't handle events if the target is an input, textarea, or select
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT'
    ) {
      return;
    }

    // Check if the event matches any of our shortcuts
    for (const shortcut of this.shortcuts) {
      if (
        event.key === shortcut.key &&
        (shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey) &&
        (shortcut.altKey === undefined || event.altKey === shortcut.altKey) &&
        (shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey) &&
        (shortcut.metaKey === undefined || event.metaKey === shortcut.metaKey)
      ) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }

  /**
   * Get all registered shortcuts
   */
  getShortcuts(): KeyboardShortcut[] {
    return [...this.shortcuts];
  }
}

/**
 * Create a keyboard navigation instance
 */
export function createKeyboardNavigation(): KeyboardNavigation {
  return new KeyboardNavigation();
}

/**
 * Helper function to create arrow key navigation for a list of elements
 */
export function createArrowKeyNavigation(
  elements: HTMLElement[],
  options: {
    vertical?: boolean;
    horizontal?: boolean;
    loop?: boolean;
    onSelect?: (element: HTMLElement) => void;
  } = {}
): () => void {
  const { vertical = true, horizontal = false, loop = true, onSelect } = options;
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!elements.length) return;
    
    const currentIndex = elements.findIndex(el => el === document.activeElement);
    let nextIndex = currentIndex;
    
    // Handle arrow keys
    if (vertical && event.key === 'ArrowDown') {
      event.preventDefault();
      nextIndex = currentIndex + 1;
    } else if (vertical && event.key === 'ArrowUp') {
      event.preventDefault();
      nextIndex = currentIndex - 1;
    } else if (horizontal && event.key === 'ArrowRight') {
      event.preventDefault();
      nextIndex = currentIndex + 1;
    } else if (horizontal && event.key === 'ArrowLeft') {
      event.preventDefault();
      nextIndex = currentIndex - 1;
    } else if (event.key === 'Enter' && currentIndex !== -1 && onSelect) {
      event.preventDefault();
      onSelect(elements[currentIndex]);
      return;
    } else {
      return;
    }
    
    // Handle looping
    if (nextIndex < 0) {
      nextIndex = loop ? elements.length - 1 : 0;
    } else if (nextIndex >= elements.length) {
      nextIndex = loop ? 0 : elements.length - 1;
    }
    
    // Focus the next element
    if (nextIndex !== currentIndex) {
      elements[nextIndex].focus();
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  
  // Return a cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}
