services:
  - type: web
    name: pikud-haoref-alerts
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    autoDeploy: false
    rootDir: ./
    healthCheckPath: /