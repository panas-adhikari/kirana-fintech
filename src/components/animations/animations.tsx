'use client';

export const cssStyles = `
  @keyframes border-spin {
    100% {
      transform: rotate(-360deg);
    }
  }
  .animate-border-spin {
    animation: border-spin 7s linear infinite;
  }
`;