# Deployment Guide for Bookshelf Application

This document outlines the deployment process for the Bookshelf application.

## Target Deployment Platform

After evaluating various deployment options, we've selected **Vercel** as our primary deployment platform for the following reasons:

1. **Next.js Optimization**: Vercel is built by the creators of Next.js and provides first-class support for Next.js applications.
2. **Ease of Use**: Simple deployment process with GitHub integration.
3. **Performance**: Global CDN, edge caching, and optimized builds.
4. **Free Tier**: Generous free tier for personal projects.
5. **Preview Deployments**: Automatic preview deployments for pull requests.

## Alternative Platforms

While Vercel is our primary choice, the application can also be deployed to:

1. **Netlify**: Similar to Vercel with good Next.js support.
2. **AWS Amplify**: Good option if you're already using AWS services.
3. **DigitalOcean App Platform**: Simple deployment with reasonable pricing.

## Local Data Storage Considerations

Since our application uses local JSON file storage, we need to consider the following for deployment:

1. **Data Persistence**: Vercel's serverless functions don't maintain persistent file storage between invocations.
2. **Solution**: We'll need to modify our application to use a database service like Supabase or MongoDB Atlas instead of local JSON files for production deployment.

## Build and Environment Settings

### Vercel Configuration

We've created a `vercel.json` file in the project root with the following configurations:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://bookshelf.vercel.app"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, max-age=0"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    }
  ]
}
```

### Environment Variables

The following environment variables need to be configured in Vercel:

1. **NEXT_PUBLIC_APP_URL**: The URL of the deployed application
2. **NEXT_PUBLIC_SUPABASE_URL**: Supabase project URL (for production database)
3. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Supabase anonymous key (for public access)

An `.env.example` file has been created in the project root as a template for the required environment variables.

### Build Optimization

The following optimizations have been implemented for the build process:

1. **Code Splitting**: Implemented via Next.js dynamic imports
2. **Image Optimization**: Using Next.js Image component
3. **CSS Optimization**: Tailwind CSS with purging unused styles
4. **JavaScript Minification**: Enabled by default in production builds

## Hosting and Deployment Configurations

### Domain Configuration

To set up a custom domain for the Bookshelf application on Vercel:

1. Go to the Vercel project dashboard
2. Navigate to "Settings" > "Domains"
3. Add your custom domain (e.g., bookshelf.yourdomain.com)
4. Follow Vercel's instructions to configure DNS settings with your domain provider

### SSL/TLS Configuration

Vercel automatically provisions SSL certificates for all domains, including custom domains. No additional configuration is required for HTTPS.

### CDN Configuration

Vercel's Edge Network automatically serves as a CDN for your application. The following assets are cached at the edge:

- Static files in the `public` directory
- Built JavaScript bundles
- Images processed by Next.js Image Optimization

The cache headers in `vercel.json` have been configured to optimize caching behavior.

### Deployment Hooks

To set up automatic deployments when changes are pushed to the repository:

1. Connect your GitHub repository to Vercel
2. Enable "Auto Deployments" in the Vercel project settings
3. Configure branch deployments as needed (e.g., main branch for production, other branches for preview)

## Testing the Deployment Process

### Deployment Helper Script

We've created a deployment helper script at `scripts/deploy.js` that automates several pre-deployment checks and tasks:

1. Validates environment variables
2. Runs tests to ensure application functionality
3. Checks for production optimizations
4. Builds the application

To use the script, run:

```bash
node scripts/deploy.js
```

### Staging Deployment

Before deploying to production, it's recommended to test the deployment in a staging environment:

1. Create a staging project in Vercel
2. Deploy the application to the staging environment
3. Verify the following aspects of the application:

#### Functional Testing

- User authentication (if applicable)
- Book entry form submission
- Book listing and filtering
- Search functionality
- Statistics display
- Edit and delete operations
- Data import/export

#### Performance Testing

- Page load times (using Lighthouse or similar tools)
- Time to interactive
- First contentful paint
- Largest contentful paint
- Cumulative layout shift

#### Cross-Browser Testing

Test the application in the following browsers:

- Chrome
- Firefox
- Safari
- Edge

#### Mobile Testing

Test the application on various mobile devices and screen sizes:

- iOS (iPhone, iPad)
- Android (various screen sizes)

### Deployment Checklist

Use the following checklist to ensure the deployment is ready for production:

- [ ] All environment variables are correctly set
- [ ] Build process completes without errors
- [ ] All pages load correctly
- [ ] All functionality works as expected
- [ ] Performance metrics meet targets
- [ ] Application is responsive on all tested devices
- [ ] Accessibility requirements are met
- [ ] Security headers are properly configured

## Production Deployment

Once the staging deployment has been thoroughly tested and all items in the checklist are complete, you can proceed with the production deployment.

### Deployment Steps

1. **Prepare for Deployment**

   Run the deployment preparation script to ensure everything is ready:

   ```bash
   npm run prepare-deploy
   ```

2. **Deploy to Production**

   Use one of the following methods to deploy to production:

   **Option 1: Using Vercel CLI**

   ```bash
   npm run deploy:production
   ```

   **Option 2: Using GitHub Integration**

   Push your changes to the main branch of your GitHub repository, and Vercel will automatically deploy to production if you've set up the GitHub integration.

   **Option 3: Using Vercel Dashboard**

   Deploy manually from the Vercel dashboard by selecting your project and clicking the "Deploy" button.

3. **Verify the Production Deployment**

   After deployment, verify that the production deployment is working correctly:

   ```bash
   npm run verify-deploy
   ```

   Follow the prompts to verify the deployment.

### Post-Deployment Tasks

1. **Monitor Application Performance**

   Use Vercel Analytics or other monitoring tools to track the application's performance in production.

2. **Set Up Alerts**

   Configure alerts for any critical issues or performance degradation.

3. **Update Documentation**

   Update any relevant documentation with the production URL and deployment details.

4. **Communicate with Stakeholders**

   Inform stakeholders that the application has been deployed to production and is ready for use.

### Rollback Procedure

If issues are discovered in the production deployment, follow these steps to roll back:

1. **Identify the Issue**

   Determine the nature and severity of the issue.

2. **Attempt Quick Fix**

   If the issue is minor and can be fixed quickly, deploy a fix immediately.

3. **Roll Back to Previous Version**

   If the issue is severe or cannot be fixed quickly, roll back to the previous stable version:

   - In the Vercel dashboard, go to the "Deployments" tab
   - Find the previous stable deployment
   - Click the three dots menu and select "Promote to Production"

4. **Communicate the Rollback**

   Inform stakeholders about the rollback and the estimated time to fix the issue.
