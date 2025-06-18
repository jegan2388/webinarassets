import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts'

interface BrandData {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  fontFamily?: string;
  companyName?: string;
  error?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Extract colors from CSS text
const extractColorsFromCSS = (cssText: string): string[] => {
  const colors: string[] = [];
  
  // Regex patterns for different color formats
  const hexPattern = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;
  const rgbPattern = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g;
  const rgbaPattern = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*[\d.]+\s*\)/g;
  const hslPattern = /hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/g;
  
  // Extract hex colors
  let match;
  while ((match = hexPattern.exec(cssText)) !== null) {
    colors.push(match[0]);
  }
  
  // Extract RGB colors
  while ((match = rgbPattern.exec(cssText)) !== null) {
    colors.push(match[0]);
  }
  
  // Extract RGBA colors
  while ((match = rgbaPattern.exec(cssText)) !== null) {
    colors.push(`rgb(${match[1]}, ${match[2]}, ${match[3]})`);
  }
  
  // Extract HSL colors
  while ((match = hslPattern.exec(cssText)) !== null) {
    colors.push(match[0]);
  }
  
  return colors;
};

// Convert RGB to Hex
const rgbToHex = (rgb: string): string => {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return rgb;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// Analyze color frequency and filter out common colors
const analyzeColors = (colors: string[]): { primary?: string; secondary?: string } => {
  if (colors.length === 0) return {};
  
  // Common colors to filter out (white, black, gray variations)
  const commonColors = [
    '#ffffff', '#fff', '#000000', '#000', '#f0f0f0', '#e0e0e0', '#d0d0d0',
    '#c0c0c0', '#b0b0b0', '#a0a0a0', '#909090', '#808080', '#707070',
    '#606060', '#505050', '#404040', '#303030', '#202020', '#101010',
    'rgb(255, 255, 255)', 'rgb(0, 0, 0)', 'rgb(240, 240, 240)'
  ];
  
  // Normalize and count colors
  const colorCounts: Record<string, number> = {};
  
  colors.forEach(color => {
    const normalized = color.toLowerCase().replace(/\s/g, '');
    const hex = normalized.startsWith('rgb') ? rgbToHex(normalized) : normalized;
    
    if (!commonColors.includes(hex) && !commonColors.includes(normalized)) {
      colorCounts[hex] = (colorCounts[hex] || 0) + 1;
    }
  });
  
  // Sort by frequency
  const sortedColors = Object.entries(colorCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([color]) => color);
  
  return {
    primary: sortedColors[0],
    secondary: sortedColors[1]
  };
};

// Extract logo URLs from HTML
const extractLogos = (doc: Document, baseUrl: string): string[] => {
  const logos: string[] = [];
  
  // Look for images with logo-related attributes
  const images = doc.querySelectorAll('img');
  
  images.forEach(img => {
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt')?.toLowerCase() || '';
    const className = img.getAttribute('class')?.toLowerCase() || '';
    const id = img.getAttribute('id')?.toLowerCase() || '';
    
    if (src && (
      alt.includes('logo') ||
      className.includes('logo') ||
      id.includes('logo') ||
      src.includes('logo')
    )) {
      // Convert relative URLs to absolute
      const logoUrl = src.startsWith('http') ? src : new URL(src, baseUrl).href;
      logos.push(logoUrl);
    }
  });
  
  // Look for SVG logos
  const svgs = doc.querySelectorAll('svg');
  svgs.forEach(svg => {
    const className = svg.getAttribute('class')?.toLowerCase() || '';
    const id = svg.getAttribute('id')?.toLowerCase() || '';
    
    if (className.includes('logo') || id.includes('logo')) {
      // For SVG, we'd need to serialize it, but for now just note it exists
      logos.push('svg-logo-found');
    }
  });
  
  return logos;
};

// Extract company name from various sources
const extractCompanyName = (doc: Document): string | undefined => {
  // Try title tag
  const title = doc.querySelector('title')?.textContent;
  if (title) {
    // Remove common suffixes
    const cleanTitle = title.replace(/\s*[-|]\s*(Home|Homepage|Welcome).*$/i, '').trim();
    if (cleanTitle && cleanTitle.length < 50) {
      return cleanTitle;
    }
  }
  
  // Try meta property og:site_name
  const ogSiteName = doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
  if (ogSiteName) return ogSiteName;
  
  // Try meta name application-name
  const appName = doc.querySelector('meta[name="application-name"]')?.getAttribute('content');
  if (appName) return appName;
  
  return undefined;
};

// Extract font family from CSS
const extractFontFamily = (cssText: string): string | undefined => {
  const fontFamilyPattern = /font-family:\s*([^;]+)/gi;
  const matches = cssText.match(fontFamilyPattern);
  
  if (matches && matches.length > 0) {
    // Get the most common font-family declaration
    const fontFamilies = matches.map(match => 
      match.replace('font-family:', '').trim().replace(/['"]/g, '')
    );
    
    // Return the first non-generic font family
    for (const font of fontFamilies) {
      if (!font.includes('serif') && !font.includes('sans-serif') && !font.includes('monospace')) {
        return font.split(',')[0].trim();
      }
    }
  }
  
  return undefined;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { websiteUrl } = await req.json()
    
    if (!websiteUrl) {
      return new Response(
        JSON.stringify({ error: 'Website URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate URL format
    let url: URL;
    try {
      url = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Fetching brand data from: ${url.href}`);

    // Fetch the website
    const response = await fetch(url.href, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BrandExtractor/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    if (!doc) {
      throw new Error('Failed to parse HTML');
    }

    // Extract all CSS (inline styles and style tags)
    let allCSS = '';
    
    // Get inline styles
    const elementsWithStyle = doc.querySelectorAll('[style]');
    elementsWithStyle.forEach(el => {
      const style = el.getAttribute('style');
      if (style) allCSS += style + ' ';
    });
    
    // Get style tag contents
    const styleTags = doc.querySelectorAll('style');
    styleTags.forEach(style => {
      if (style.textContent) allCSS += style.textContent + ' ';
    });

    // Try to fetch external CSS files (first few only to avoid timeout)
    const linkTags = doc.querySelectorAll('link[rel="stylesheet"]');
    const cssPromises: Promise<string>[] = [];
    
    for (let i = 0; i < Math.min(3, linkTags.length); i++) {
      const link = linkTags[i];
      const href = link.getAttribute('href');
      if (href) {
        const cssUrl = href.startsWith('http') ? href : new URL(href, url.href).href;
        cssPromises.push(
          fetch(cssUrl, { signal: AbortSignal.timeout(5000) })
            .then(res => res.ok ? res.text() : '')
            .catch(() => '') // Ignore CSS fetch errors
        );
      }
    }

    const externalCSS = await Promise.all(cssPromises);
    allCSS += externalCSS.join(' ');

    // Extract brand elements
    const colors = extractColorsFromCSS(allCSS);
    const { primary, secondary } = analyzeColors(colors);
    const logos = extractLogos(doc, url.href);
    const companyName = extractCompanyName(doc);
    const fontFamily = extractFontFamily(allCSS);

    const brandData: BrandData = {
      primaryColor: primary,
      secondaryColor: secondary,
      logoUrl: logos[0], // Take the first logo found
      fontFamily,
      companyName
    };

    console.log('Extracted brand data:', brandData);

    return new Response(
      JSON.stringify(brandData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Brand extraction error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: `Failed to extract brand elements: ${errorMessage}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})