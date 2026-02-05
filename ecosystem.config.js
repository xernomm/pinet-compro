module.exports = {
  apps: [
    {
      name: 'pinet-backend',
      script: 'npm',
      args: 'start',
      cwd: '/home/vanka-ai/pinet-compro/backend',
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
      name: 'pinet-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/vanka-ai/pinet-compro/frontend',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        PORT: 3000,
        BROWSER: 'none'
      }
    },
    {
      name: 'pinet-admin-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/vanka-ai/pinet-compro/admin-frontend',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        PORT: 3001,
        BROWSER: 'none'
      }
    }
  ]
};
