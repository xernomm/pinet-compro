module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './backend',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'node_modules/react-scripts/bin/react-scripts.js',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        PORT: 3000,
        BROWSER: 'none'
      }
    },
    {
      name: 'admin-frontend',
      cwd: './admin-frontend',
      script: 'node_modules/react-scripts/bin/react-scripts.js',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        PORT: 3001,
        BROWSER: 'none'
      }
    }
  ]
};
