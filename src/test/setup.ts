import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock canvas-confetti in JSDOM
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock window.print
window.print = vi.fn();
