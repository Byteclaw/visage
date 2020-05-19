import '@testing-library/jest-dom';

window.HTMLElement.prototype.scrollIntoView = function () {};

window.getSelection = () => '' as any;
