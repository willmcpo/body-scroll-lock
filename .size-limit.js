module.exports = [
  {
    path: 'lib/bodyScrollLock.esm.js',
    name: 'Total',
    limit: '1 KB',
  },
  {
    path: 'lib/bodyScrollLock.esm.js',
    name: 'disableBodyScroll',
    import: '{ disableBodyScroll }',
    limit: '800 B',
  },
  {
    path: 'lib/bodyScrollLock.esm.js',
    name: 'clearAllBodyScrollLocks',
    import: '{ clearAllBodyScrollLocks }',
    limit: '400 B',
  },
  {
    path: 'lib/bodyScrollLock.esm.js',
    name: 'enableBodyScroll',
    import: '{ enableBodyScroll }',
    limit: '450 B',
  },
]
