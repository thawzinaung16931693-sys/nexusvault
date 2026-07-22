import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  console.log("Seeding database...");

  // --- Categories ---
  const categoryData = [
    { name: "AI Tools", slug: "ai-tools", description: "Artificial intelligence and machine learning tools", color: "#9D4EDD" },
    { name: "Media & Streaming", slug: "media-streaming", description: "Video, music, and content streaming services", color: "#7B2CBF" },
    { name: "Creative Software", slug: "creative-software", description: "Design, video editing, and creative tools", color: "#5A189A" },
    { name: "Developer Tools", slug: "developer-tools", description: "IDEs, hosting, and development platforms", color: "#3C096C" },
    { name: "Productivity", slug: "productivity", description: "Workflow automation and productivity suites", color: "#E0AAFF" },
    { name: "Security & VPN", slug: "security-vpn", description: "Cybersecurity, VPN, and privacy tools", color: "#10002B" },
  ];

  console.log("  Inserting categories...");
  const categories = await db.insert(schema.categories).values(categoryData).returning();
  console.log(`  Inserted ${categories.length} categories`);

  // --- Products ---
  const productData = [
    {
      name: "ChatGPT Plus",
      slug: "chatgpt-plus",
      description: "Access to GPT-4, DALL-E, and advanced AI capabilities. Faster response times and priority access during peak hours.",
      shortDescription: "Premium AI assistant with GPT-4 access",
      price: "20.00",
      originalPrice: "25.00",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      categoryId: categories[0].id,
      type: "subscription" as const,
      billingPeriod: "monthly" as const,
      features: JSON.stringify(["GPT-4 access", "DALL-E image generation", "Priority access", "Faster responses", "Plugin support"]),
      isActive: "yes",
      isFeatured: "yes",
      rating: "4.80",
      reviewCount: 2450,
      salesCount: 15000,
    },
    {
      name: "Midjourney Pro",
      slug: "midjourney-pro",
      description: "AI-powered image generation with unlimited relaxed generations, 15h fast GPU time, and stealth mode.",
      shortDescription: "Professional AI image generation",
      price: "30.00",
      image: "https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=800",
      categoryId: categories[0].id,
      type: "subscription" as const,
      billingPeriod: "monthly" as const,
      features: JSON.stringify(["15h fast GPU time", "Unlimited relaxed mode", "Stealth mode", "Commercial license"]),
      isActive: "yes",
      isFeatured: "yes",
      rating: "4.70",
      reviewCount: 1800,
      salesCount: 9500,
    },
    {
      name: "Netflix Premium",
      slug: "netflix-premium",
      description: "Stream unlimited movies and TV shows in 4K Ultra HD on up to 4 screens simultaneously.",
      shortDescription: "4K streaming on 4 screens",
      price: "22.99",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ced95?w=800",
      categoryId: categories[1].id,
      type: "subscription" as const,
      billingPeriod: "monthly" as const,
      features: JSON.stringify(["4K Ultra HD", "4 simultaneous screens", "Downloads on 6 devices", "No ads"]),
      isActive: "yes",
      isFeatured: "yes",
      rating: "4.50",
      reviewCount: 5200,
      salesCount: 25000,
    },
    {
      name: "Spotify Premium Family",
      slug: "spotify-premium-family",
      description: "Ad-free music streaming for up to 6 family members with offline downloads.",
      shortDescription: "Music for the whole family",
      price: "16.99",
      image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800",
      categoryId: categories[1].id,
      type: "subscription" as const,
      billingPeriod: "monthly" as const,
      features: JSON.stringify(["6 premium accounts", "Ad-free listening", "Offline downloads", "Family Mix playlist"]),
      isActive: "yes",
      isFeatured: "no",
      rating: "4.60",
      reviewCount: 3100,
      salesCount: 18000,
    },
    {
      name: "Adobe Creative Cloud",
      slug: "adobe-creative-cloud",
      description: "Complete collection of 20+ creative apps including Photoshop, Illustrator, Premiere Pro, and more.",
      shortDescription: "All Adobe creative apps in one plan",
      price: "54.99",
      originalPrice: "79.99",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800",
      categoryId: categories[2].id,
      type: "subscription" as const,
      billingPeriod: "monthly" as const,
      features: JSON.stringify(["20+ creative apps", "100GB cloud storage", "Adobe Fonts", "Adobe Portfolio", "Behance integration"]),
      isActive: "yes",
      isFeatured: "yes",
      rating: "4.40",
      reviewCount: 4100,
      salesCount: 12000,
    },
    {
      name: "Figma Professional",
      slug: "figma-professional",
      description: "Collaborative design tool with unlimited projects, team libraries, and advanced prototyping.",
      shortDescription: "Professional UI/UX design tool",
      price: "15.00",
      image: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800",
      categoryId: categories[2].id,
      type: "subscription" as const,
      billingPeriod: "monthly" as const,
      features: JSON.stringify(["Unlimited projects", "Team libraries", "Advanced prototyping", "Dev mode", "Branching"]),
      isActive: "yes",
      isFeatured: "no",
      rating: "4.85",
      reviewCount: 2800,
      salesCount: 8500,
    },
    {
      name: "GitHub Copilot Pro",
      slug: "github-copilot-pro",
      description: "AI pair programming that helps you write code faster with contextual suggestions.",
      shortDescription: "AI-powered code completion",
      price: "19.00",
      image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800",
      categoryId: categories[3].id,
      type: "subscription" as const,
      billingPeriod: "monthly" as const,
      features: JSON.stringify(["Code suggestions", "Chat assistance", "Multi-language support", "IDE integration", "Security scanning"]),
      isActive: "yes",
      isFeatured: "yes",
      rating: "4.60",
      reviewCount: 1950,
      salesCount: 11000,
    },
    {
      name: "Vercel Pro",
      slug: "vercel-pro",
      description: "Deploy and scale web applications with automatic CI/CD, edge functions, and analytics.",
      shortDescription: "Frontend cloud platform for deployment",
      price: "20.00",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      categoryId: categories[3].id,
      type: "subscription" as const,
      billingPeriod: "monthly" as const,
      features: JSON.stringify(["Unlimited deployments", "Edge functions", "Analytics", "DDoS protection", "Custom domains"]),
      isActive: "yes",
      isFeatured: "no",
      rating: "4.70",
      reviewCount: 1200,
      salesCount: 6500,
    },
    {
      name: "Notion Team",
      slug: "notion-team",
      description: "All-in-one workspace for notes, docs, wikis, and project management with AI features.",
      shortDescription: "Connected workspace with AI",
      price: "10.00",
      image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800",
      categoryId: categories[4].id,
      type: "subscription" as const,
      billingPeriod: "monthly" as const,
      features: JSON.stringify(["Unlimited pages", "Notion AI", "Custom automations", "Advanced permissions", "Admin tools"]),
      isActive: "yes",
      isFeatured: "no",
      rating: "4.75",
      reviewCount: 3500,
      salesCount: 20000,
    },
    {
      name: "NordVPN 2-Year Plan",
      slug: "nordvpn-2-year",
      description: "Military-grade encryption with 5500+ servers in 60 countries. Protect all your devices.",
      shortDescription: "Premium VPN with global servers",
      price: "83.76",
      originalPrice: "286.80",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
      categoryId: categories[5].id,
      type: "subscription" as const,
      billingPeriod: "yearly" as const,
      features: JSON.stringify(["5500+ servers", "6 simultaneous connections", "No-logs policy", "Threat protection", "Dark web monitor"]),
      isActive: "yes",
      isFeatured: "yes",
      rating: "4.55",
      reviewCount: 4800,
      salesCount: 30000,
    },
  ];

  console.log("  Inserting products...");
  const products = await db.insert(schema.products).values(productData).returning();
  console.log(`  Inserted ${products.length} products`);

  console.log("");
  console.log("Database seeded successfully!");
  console.log(`  - ${categories.length} categories`);
  console.log(`  - ${products.length} products`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
