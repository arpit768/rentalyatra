# 🚀 Production Deployment Guide

Complete guide to deploy Yatra Rentals Nepal to production.

---

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database setup complete
- [ ] Payment gateway credentials obtained
- [ ] Email service configured
- [ ] Build tested locally
- [ ] Production domain ready
- [ ] SSL certificate (auto with most platforms)

---

## 🌟 Option 1: Vercel (Recommended for Frontend)

**Best for:** React apps with serverless backend

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
cd "/home/arpitswar/Downloads/projects/Rental "
vercel
```

### Step 4: Environment Variables
```bash
vercel env add VITE_API_URL
vercel env add GEMINI_API_KEY
```

### Step 5: Production Deploy
```bash
vercel --prod
```

### Configuration (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "env": {
    "VITE_API_URL": "@api_url",
    "GEMINI_API_KEY": "@gemini_key"
  }
}
```

**Pros:** Fast, automatic SSL, CDN, preview deployments
**Cons:** Limited backend support (use for frontend only)

---

## 🚂 Option 2: Railway (Recommended for Full-Stack)

**Best for:** Full-stack apps with backend

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login
```bash
railway login
```

### Step 3: Initialize Project
```bash
railway init
```

### Step 4: Deploy Frontend
```bash
cd "/home/arpitswar/Downloads/projects/Rental "
railway up
```

### Step 5: Deploy Backend
```bash
cd server
railway up
```

### Step 6: Add Services
- PostgreSQL database (click to add)
- Redis cache (optional)
- Set environment variables in dashboard

### Environment Variables
```
# Frontend
VITE_API_URL=https://your-api.railway.app
GEMINI_API_KEY=your_key

# Backend
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
PORT=3001
```

**Pros:** Easy full-stack, free PostgreSQL, automatic HTTPS
**Cons:** Limited free tier hours

---

## 🎨 Option 3: Render

**Best for:** Free tier hosting

### Step 1: Connect GitHub
1. Push code to GitHub
2. Go to render.com
3. Click "New" → "Web Service"
4. Connect repository

### Step 2: Configure Frontend
```yaml
Name: yatra-rentals-frontend
Environment: Node
Build Command: npm install && npm run build
Start Command: npm run preview
```

### Step 3: Configure Backend
```yaml
Name: yatra-rentals-backend
Environment: Node
Build Command: cd server && npm install
Start Command: cd server && npm start
```

### Step 4: Add PostgreSQL
- Click "New" → "PostgreSQL"
- Copy connection string
- Add to backend environment

**Pros:** Free tier with SSL, PostgreSQL included
**Cons:** Slower cold starts on free tier

---

## ☁️ Option 4: AWS (Professional Production)

### Prerequisites
- AWS Account
- AWS CLI installed
- Domain name

### Step 1: Frontend (S3 + CloudFront)

**Create S3 Bucket:**
```bash
aws s3 mb s3://yatra-rentals-nepal
aws s3 website s3://yatra-rentals-nepal --index-document index.html
```

**Build and Upload:**
```bash
npm run build
aws s3 sync dist/ s3://yatra-rentals-nepal
```

**Create CloudFront Distribution:**
```bash
aws cloudfront create-distribution \
  --origin-domain-name yatra-rentals-nepal.s3.amazonaws.com
```

### Step 2: Backend (EC2 or Elastic Beanstalk)

**EC2 Deployment:**
```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone your-repo
cd server
npm install
npm install -g pm2

# Start with PM2
pm2 start server.js --name yatra-backend
pm2 startup
pm2 save
```

**Elastic Beanstalk:**
```bash
eb init -p node.js yatra-rentals
eb create yatra-prod
eb deploy
```

### Step 3: Database (RDS)
```bash
aws rds create-db-instance \
  --db-instance-identifier yatra-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password your-password \
  --allocated-storage 20
```

**Pros:** Enterprise-grade, scalable, full control
**Cons:** Complex setup, higher cost

---

## 🐳 Option 5: Docker + DigitalOcean

### Step 1: Create Dockerfiles

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ .
EXPOSE 3001
CMD ["node", "server.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:3001
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=yatra
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Step 2: Deploy to DigitalOcean
```bash
# Create droplet
doctl compute droplet create yatra \
  --image docker-20-04 \
  --size s-2vcpu-4gb \
  --region sgp1

# SSH and deploy
ssh root@your-droplet-ip
git clone your-repo
docker-compose up -d
```

**Pros:** Full control, predictable pricing, Docker benefits
**Cons:** Manual server management

---

## 🔐 Environment Variables

### Frontend (.env.production)
```env
VITE_API_URL=https://api.yatrarentals.com
GEMINI_API_KEY=your_gemini_api_key
VITE_ENVIRONMENT=production
VITE_SENTRY_DSN=your_sentry_dsn
```

### Backend (.env.production)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/yatra
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d

# Payment
ESEWA_MERCHANT_ID=your_merchant_id
ESEWA_SECRET_KEY=your_secret
KHALTI_PUBLIC_KEY=your_public_key
KHALTI_SECRET_KEY=your_secret

# Email
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@yatrarentals.com

# SMS
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE=+977xxxxxxxxxx

# Storage
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=yatra-uploads
AWS_REGION=ap-south-1

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

---

## 🗄️ Database Migration

### PostgreSQL Setup
```bash
# Connect to database
psql $DATABASE_URL

# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

---

## 🔍 Post-Deployment Checklist

### Testing
- [ ] Homepage loads correctly
- [ ] Login/signup works
- [ ] Vehicle browsing works
- [ ] Booking creation works
- [ ] Payment processing works
- [ ] AI chatbot responds
- [ ] Image uploads work
- [ ] Notifications send

### Performance
- [ ] Page load < 3 seconds
- [ ] Images optimized
- [ ] Gzip compression enabled
- [ ] CDN configured
- [ ] Cache headers set

### Security
- [ ] HTTPS enabled
- [ ] Security headers set
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] SQL injection prevention
- [ ] XSS protection

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Log aggregation

---

## 📊 Monitoring Setup

### Sentry (Error Tracking)
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: "production",
  tracesSampleRate: 1.0,
});
```

### Google Analytics
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🚨 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Loading
```bash
# Verify variables
printenv | grep VITE_
printenv | grep NODE_
```

### CORS Errors
```javascript
// server.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Database Connection Fails
```bash
# Test connection
psql $DATABASE_URL

# Check SSL requirement
DATABASE_URL="postgresql://...?sslmode=require"
```

---

## 💰 Cost Estimates

### Small Scale (< 1000 users)
- **Vercel + Railway:** $0-20/month
- **Render:** $0-25/month (free tier available)
- **DigitalOcean:** $12/month (basic droplet)

### Medium Scale (1000-10000 users)
- **AWS:** $50-200/month
- **Railway + PostgreSQL:** $20-50/month
- **DigitalOcean + Spaces:** $24-60/month

### Large Scale (10000+ users)
- **AWS (optimized):** $200-1000/month
- **Multi-region setup:** $500+/month

---

## 🎯 Recommended Setup

**For MVP/Startup:**
- Frontend: **Vercel** (free tier)
- Backend: **Railway** (free tier)
- Database: **Railway PostgreSQL**
- Storage: **Cloudinary** (free tier)

**For Production:**
- Frontend: **Vercel** ($20/month)
- Backend: **Railway** ($5/month)
- Database: **Railway PostgreSQL** ($10/month)
- Storage: **AWS S3** ($5/month)
- Email: **SendGrid** ($15/month)
- **Total: ~$55/month**

---

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test locally first
4. Check platform status pages
5. Review error messages in Sentry

---

**Deployment Status:** Ready to deploy!
**Estimated Time:** 30-60 minutes
**Difficulty:** Intermediate

🚀 **Ready to launch Yatra Rentals Nepal!**
