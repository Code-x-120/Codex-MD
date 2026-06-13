module.exports = {
  apps: [{
    name: 'codex-md',
    script: 'index.js',
    interpreter: 'node',
    node_args: '--experimental-specifier-resolution=node'
  }]
};