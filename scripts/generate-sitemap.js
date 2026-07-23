const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Simple function to fetch data for older Node versions without native fetch
function fetchData(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', err => reject(err));
    });
}

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function generateSitemap() {
    console.log('Generating dynamic sitemap...');

    // 1. Determine environment (Support Local, Docker Local, and Docker Prod)
    const isDev = process.env.NODE_ENV !== 'production';
    
    // 2. Fetch URLs from .env based on environment
    const domain = isDev 
        ? (process.env.REACT_APP_CLIENT_URL_DEV || 'http://127.0.0.1:3000') 
        : (process.env.REACT_APP_CLIENT_URL_PROD || 'https://www.modellink.com');
        
    const apiUrl = isDev 
        ? (process.env.REACT_APP_BASE_API_DEV || 'http://127.0.0.1:8000')
        : (process.env.REACT_APP_BASE_API_PROD || 'http://modellink_backend:8000');
        
    const fetchUrl = `${apiUrl}/api/aiModel`;

    // 3. Define static routes
    const staticRoutes = [
        '', 
        '/about', 
        '/models', 
        '/contact', 
        '/policy', 
        '/directory'
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 4. Add static routes
    staticRoutes.forEach(route => {
        xml += `  <url>\n`;
        xml += `    <loc>${domain}${route}</loc>\n`;
        xml += `    <changefreq>${route === '' ? 'daily' : 'monthly'}</changefreq>\n`;
        xml += `    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n`;
        xml += `  </url>\n`;
    });

    // 5. Try to fetch dynamic models from the backend API
    try {
        console.log(`Fetching models from ${fetchUrl}...`);
        
        const response = await fetchData(fetchUrl);
        // Look for the models array in the standard JSend API response structures
        let models = [];
        if (response.data && response.data.models) {
            models = response.data.models;
        } else if (response.data && response.data.data && response.data.data.models) {
            models = response.data.data.models;
        } else if (Array.isArray(response.data)) {
            models = response.data;
        } else if (Array.isArray(response)) {
            models = response;
        }
        
        if (Array.isArray(models) && models.length > 0) {
            console.log(`Found ${models.length} dynamic models. Adding to sitemap...`);
            models.forEach(model => {
                xml += `  <url>\n`;
                xml += `    <loc>${domain}/models/${model._id || model.id}</loc>\n`;
                if(model.updatedAt) {
                    xml += `    <lastmod>${model.updatedAt.split('T')[0]}</lastmod>\n`;
                }
                xml += `    <changefreq>monthly</changefreq>\n`;
                xml += `    <priority>0.9</priority>\n`;
                xml += `  </url>\n`;
            });
        } else {
            console.log('No models found or wrong response format, proceeding with static routes only.');
        }
    } catch (error) {
        console.warn('⚠️ Could not fetch dynamic models from local backend. Is the backend running?');
        console.warn('Proceeding to generate sitemap with static routes only.');
    }

    xml += `</urlset>`;

    // 5. Write to public folder, overwriting existing sitemap.xml
    const publicPath = path.join(__dirname, '../public', 'sitemap.xml');
    fs.writeFileSync(publicPath, xml);
    console.log(`✅ Sitemap successfully generated and saved to ${publicPath}`);
}

generateSitemap();
