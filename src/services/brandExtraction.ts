export interface BrandData {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  fontFamily?: string;
  companyName?: string;
  error?: string;
}

export const extractBrandElements = async (websiteUrl: string): Promise<BrandData> => {
  try {
    // For now, we'll return mock data since we need Supabase setup
    // In production, this would call the Supabase Edge Function
    
    console.log('Extracting brand elements from:', websiteUrl);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock brand data based on common patterns
    const mockBrandData: BrandData = {
      primaryColor: '#2563eb', // Blue
      secondaryColor: '#64748b', // Gray
      logoUrl: undefined, // Would be extracted from the website
      fontFamily: 'Inter, system-ui, sans-serif',
      companyName: extractCompanyNameFromUrl(websiteUrl)
    };
    
    return mockBrandData;
    
    // TODO: Uncomment this when Supabase is set up
    /*
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration not found. Please set up Supabase to enable brand extraction.');
    }
    
    const response = await fetch(`${supabaseUrl}/functions/v1/extract-brand`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ websiteUrl })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to extract brand elements`);
    }
    
    const brandData: BrandData = await response.json();
    return brandData;
    */
    
  } catch (error) {
    console.error('Brand extraction error:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to extract brand elements'
    };
  }
};

// Helper function to extract company name from URL
const extractCompanyNameFromUrl = (url: string): string | undefined => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const hostname = urlObj.hostname.replace('www.', '');
    const parts = hostname.split('.');
    
    if (parts.length >= 2) {
      // Take the domain name part (before .com, .org, etc.)
      const domainName = parts[parts.length - 2];
      // Capitalize first letter
      return domainName.charAt(0).toUpperCase() + domainName.slice(1);
    }
    
    return undefined;
  } catch {
    return undefined;
  }
};