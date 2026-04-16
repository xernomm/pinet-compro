module.exports = {
  apps: [
    {
      name: 'pinet-backend',
      script: 'server.js',
      cwd: '/opt/pinet-compro/backend',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'pinet-admin-frontend',
      script: './node_modules/.bin/serve',
      args: ['-s', 'build', '-l', '3001'],
      cwd: '/opt/pinet-compro/admin-frontend',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
