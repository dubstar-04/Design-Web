import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// jsdom does not provide ResizeObserver
global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
