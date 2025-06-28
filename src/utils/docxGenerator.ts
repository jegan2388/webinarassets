import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, WidthType, Table, TableRow, TableCell, ShadingType } from 'docx';
import { saveAs } from 'file-saver';
import { GeneratedAsset } from '../App';
import { BrandData } from '../services/brandExtraction';

// Convert hex color to RGB values for DOCX
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '059669'; // Default emerald color
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  // Convert to hex string without #
  return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
};

// Get brand color or default
const getBrandColor = (brandData?: BrandData | null): string => {
  if (brandData?.primaryColor) {
    return hexToRgb(brandData.primaryColor);
  }
  return '059669'; // Default emerald-600
};

// Format content for different asset types
const formatAssetContent = (asset: GeneratedAsset): Paragraph[] => {
  const paragraphs: Paragraph[] = [];
  
  if (asset.type === 'Twitter Thread') {
    // Split Twitter thread into individual tweets
    const tweets = asset.content.split('\n\n').filter(tweet => tweet.trim());
    
    tweets.forEach((tweet, index) => {
      const tweetNumber = index + 1;
      
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Tweet ${tweetNumber}:`,
              bold: true,
              color: '475569', // slate-600
              size: 22, // 11pt
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: tweet.trim(),
              size: 22, // 11pt
            }),
          ],
          spacing: { after: 200 },
          border: {
            left: {
              color: 'E2E8F0', // slate-200
              size: 6,
              style: BorderStyle.SINGLE,
            },
          },
          indent: { left: 200 },
        })
      );
    });
  } else if (asset.type === 'Quote Cards') {
    // Format quote cards with special styling
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `"${asset.content}"`,
            italics: true,
            size: 28, // 14pt
            color: '1F2937', // gray-800
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
        border: {
          top: { color: 'E5E7EB', size: 6, style: BorderStyle.SINGLE },
          bottom: { color: 'E5E7EB', size: 6, style: BorderStyle.SINGLE },
          left: { color: 'E5E7EB', size: 6, style: BorderStyle.SINGLE },
          right: { color: 'E5E7EB', size: 6, style: BorderStyle.SINGLE },
        },
        indent: { left: 400, right: 400 },
      })
    );
  } else {
    // Regular content formatting
    const lines = asset.content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.trim()) {
        // Check if line is a subject line (starts with "Subject:")
        const isSubjectLine = line.trim().startsWith('Subject:');
        
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.trim(),
                bold: isSubjectLine,
                size: 22, // 11pt
                color: isSubjectLine ? '059669' : undefined, // emerald-600 for subject lines
              }),
            ],
            spacing: { 
              before: index === 0 ? 0 : 100,
              after: isSubjectLine ? 200 : 100 
            },
          })
        );
      } else if (index < lines.length - 1) {
        // Add spacing for empty lines (but not at the end)
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: '' })],
            spacing: { after: 100 },
          })
        );
      }
    });
  }
  
  return paragraphs;
};

// Create a section divider
const createSectionDivider = (brandColor: string): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun({
        text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        color: brandColor,
        size: 16,
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 400 },
  });
};

// Generate the DOCX document
export const generateDocx = async (
  assets: GeneratedAsset[], 
  brandData?: BrandData | null,
  userEmail?: string
): Promise<void> => {
  const brandColor = getBrandColor(brandData);
  const companyName = brandData?.companyName || 'Your Company';
  
  // Group assets by type
  const assetsByType = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) {
      acc[asset.type] = [];
    }
    acc[asset.type].push(asset);
    return acc;
  }, {} as Record<string, GeneratedAsset[]>);

  // Create document sections
  const documentChildren: (Paragraph | Table)[] = [];

  // Title page
  documentChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Marketing Assets Collection',
          bold: true,
          size: 48, // 24pt
          color: brandColor,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated by ContentRemix`,
          size: 24, // 12pt
          color: '6B7280', // gray-500
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // Add user email if provided
  if (userEmail) {
    documentChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Prepared for: ${userEmail}`,
            size: 22, // 11pt
            color: '6B7280', // gray-500
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  // Add generation date
  documentChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated on: ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}`,
          size: 22, // 11pt
          color: '6B7280', // gray-500
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Table of Contents
  documentChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Table of Contents',
          bold: true,
          size: 32, // 16pt
          color: brandColor,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 },
    })
  );

  // Add TOC entries
  Object.keys(assetsByType).forEach((assetType, index) => {
    const count = assetsByType[assetType].length;
    documentChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. ${assetType}`,
            size: 24, // 12pt
            bold: true,
          }),
          new TextRun({
            text: ` (${count} asset${count > 1 ? 's' : ''})`,
            size: 22, // 11pt
            color: '6B7280', // gray-500
          }),
        ],
        spacing: { after: 100 },
        indent: { left: 200 },
      })
    );
  });

  // Add section divider
  documentChildren.push(createSectionDivider(brandColor));

  // Generate content for each asset type
  Object.entries(assetsByType).forEach(([assetType, typeAssets], sectionIndex) => {
    // Section header
    documentChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${sectionIndex + 1}. ${assetType}`,
            bold: true,
            size: 36, // 18pt
            color: brandColor,
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 600, after: 300 },
      })
    );

    // Section description
    const descriptions: Record<string, string> = {
      'LinkedIn Posts': 'Professional social media content designed to build thought leadership and engage your network.',
      'Sales Outreach Emails': 'Direct, value-focused email templates for prospecting and lead generation.',
      'Marketing Nurture Emails': 'Educational email sequences to build relationships and guide prospects through your funnel.',
      'Quote Cards': 'Shareable visual content featuring key insights and memorable quotes from your content.',
      'Video Repurposing Ideas': 'Strategic guidance for creating short-form video content from your original material.',
      'Twitter Thread': 'Engaging Twitter content that breaks down complex topics into digestible, shareable insights.',
    };

    if (descriptions[assetType]) {
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: descriptions[assetType],
              size: 22, // 11pt
              color: '4B5563', // gray-600
              italics: true,
            }),
          ],
          spacing: { after: 300 },
        })
      );
    }

    // Add each asset in this type
    typeAssets.forEach((asset, assetIndex) => {
      // Asset title
      if (typeAssets.length > 1) {
        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${assetType} ${assetIndex + 1}`,
                bold: true,
                size: 28, // 14pt
                color: '374151', // gray-700
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );
      }

      // Asset content
      const contentParagraphs = formatAssetContent(asset);
      documentChildren.push(...contentParagraphs);

      // Add spacing between assets
      if (assetIndex < typeAssets.length - 1) {
        documentChildren.push(
          new Paragraph({
            children: [new TextRun({ text: '' })],
            spacing: { after: 300 },
          })
        );
      }
    });

    // Add section divider (except for last section)
    if (sectionIndex < Object.keys(assetsByType).length - 1) {
      documentChildren.push(createSectionDivider(brandColor));
    }
  });

  // Footer section
  documentChildren.push(
    createSectionDivider(brandColor),
    new Paragraph({
      children: [
        new TextRun({
          text: 'About ContentRemix',
          bold: true,
          size: 28, // 14pt
          color: brandColor,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'ContentRemix transforms your existing content into comprehensive marketing campaigns. ',
          size: 22, // 11pt
        }),
        new TextRun({
          text: 'Visit us at contentremix.ai to create more assets from your content.',
          size: 22, // 11pt
          color: brandColor,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated with ❤️ by ContentRemix • ${new Date().getFullYear()}`,
          size: 20, // 10pt
          color: '9CA3AF', // gray-400
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200 },
    })
  );

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: documentChildren,
      },
    ],
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22, // 11pt default
          },
          paragraph: {
            spacing: {
              line: 276, // 1.15 line spacing
            },
          },
        },
      },
    },
  });

  // Generate and download the document
  try {
    const blob = await Packer.toBlob(doc);
    const fileName = `content-marketing-assets-${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw new Error('Failed to generate document. Please try again.');
  }
};