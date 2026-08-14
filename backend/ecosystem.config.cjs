module.exports = {
  apps: [
    {
      name: 'autorent-backend',
      script: './dist/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/pm2_error.log',
      out_file: './logs/pm2_out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
