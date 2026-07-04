import { db } from "@/db";
import {
  siteSettings,
  services,
  projects,
  teamMembers,
  adminUsers,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  // Check if already seeded
  const existing = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "site_name"))
    .limit(1);

  if (existing.length > 0) return;

  // Site settings
  const settings = [
    { key: "site_name", value: "ARCFORM" },
    { key: "site_tagline", value: "Architecture · Design · BIM" },
    {
      key: "hero_title",
      value: "Shaping Spaces\nThat Inspire",
    },
    {
      key: "hero_subtitle",
      value:
        "We blend visionary architecture, elegant design, and cutting-edge BIM technology to create buildings that stand the test of time.",
    },
    {
      key: "about_title",
      value: "We Design The Future",
    },
    {
      key: "about_text",
      value:
        "With over 15 years of experience in architecture, interior design, and BIM consulting, our studio delivers projects that balance aesthetic excellence with technical precision. From concept to completion, we leverage Building Information Modeling to ensure every detail is coordinated, sustainable, and built to last.",
    },
    {
      key: "about_stat_1_number",
      value: "200+",
    },
    {
      key: "about_stat_1_label",
      value: "Projects Completed",
    },
    {
      key: "about_stat_2_number",
      value: "15+",
    },
    {
      key: "about_stat_2_label",
      value: "Years Experience",
    },
    {
      key: "about_stat_3_number",
      value: "50+",
    },
    {
      key: "about_stat_3_label",
      value: "Team Members",
    },
    {
      key: "contact_email",
      value: "hello@arcform.studio",
    },
    {
      key: "contact_phone",
      value: "+1 (555) 123-4567",
    },
    {
      key: "contact_address",
      value: "123 Design District, Suite 400\nNew York, NY 10001",
    },
    {
      key: "footer_text",
      value: "© 2025 ARCFORM. All rights reserved.",
    },
  ];

  await db.insert(siteSettings).values(
    settings.map((s) => ({ key: s.key, value: s.value }))
  );

  // Services
  await db.insert(services).values([
    {
      title: "Architecture",
      description:
        "From residential to commercial, we design buildings that are functional, sustainable, and visually stunning. Our approach integrates site context, client vision, and environmental responsibility.",
      icon: "building",
      sortOrder: 1,
    },
    {
      title: "Interior Design",
      description:
        "We craft interiors that tell your story. Our design philosophy balances comfort with elegance, using materials, lighting, and spatial planning to create memorable environments.",
      icon: "palette",
      sortOrder: 2,
    },
    {
      title: "BIM Consulting",
      description:
        "Our BIM expertise streamlines your project lifecycle. From 3D modeling to clash detection, 4D scheduling, and 5D cost estimation — we make complexity manageable.",
      icon: "cube",
      sortOrder: 3,
    },
    {
      title: "Urban Planning",
      description:
        "We envision vibrant communities and sustainable urban ecosystems. Our masterplanning services shape neighborhoods, campuses, and mixed-use developments.",
      icon: "map",
      sortOrder: 4,
    },
    {
      title: "Sustainability",
      description:
        "Green design is in our DNA. We integrate passive strategies, renewable materials, and energy modeling to achieve LEED, WELL, and Passive House certifications.",
      icon: "leaf",
      sortOrder: 5,
    },
    {
      title: "Project Management",
      description:
        "End-to-end project management ensures your vision is realized on time and on budget. We coordinate every stakeholder from concept through handover.",
      icon: "clipboard",
      sortOrder: 6,
    },
  ]);

  // Projects
  await db.insert(projects).values([
    {
      title: "The Glass Pavilion",
      slug: "glass-pavilion",
      description:
        "A striking glass-and-steel cultural center that blurs the boundary between indoor and outdoor spaces. The pavilion features a parametric roof structure and floor-to-ceiling glazing.",
      category: "Commercial",
      imageUrl:
        "https://images.pexels.com/photos/15577446/pexels-photo-15577446.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      client: "City Arts Foundation",
      location: "New York, USA",
      year: "2024",
      published: true,
      sortOrder: 1,
    },
    {
      title: "Horizon Tower",
      slug: "horizon-tower",
      description:
        "A 45-story mixed-use skyscraper with a twisting façade that maximizes natural light and ventilation. The tower integrates smart building systems and BIM-driven construction coordination.",
      category: "High-Rise",
      imageUrl:
        "https://images.pexels.com/photos/11692835/pexels-photo-11692835.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      client: "Skyline Developments",
      location: "Dubai, UAE",
      year: "2023",
      published: true,
      sortOrder: 2,
    },
    {
      title: "Minimalist Villa",
      slug: "minimalist-villa",
      description:
        "A luxurious private residence embracing minimalist principles. Clean lines, natural materials, and seamless indoor-outdoor living define this coastal retreat.",
      category: "Residential",
      imageUrl:
        "https://images.pexels.com/photos/9458996/pexels-photo-9458996.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      client: "Private Client",
      location: "Malibu, USA",
      year: "2024",
      published: true,
      sortOrder: 3,
    },
    {
      title: "Urban Campus",
      slug: "urban-campus",
      description:
        "A technology campus masterplan featuring interconnected buildings, green courtyards, and sustainable infrastructure. Full BIM coordination from design through construction.",
      category: "Masterplan",
      imageUrl:
        "https://images.pexels.com/photos/5323853/pexels-photo-5323853.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      client: "TechVenture Corp",
      location: "Austin, USA",
      year: "2023",
      published: true,
      sortOrder: 4,
    },
    {
      title: "The Reflections",
      slug: "the-reflections",
      description:
        "A waterfront residential complex with a reflective glass facade that mirrors the surrounding landscape. The project achieved LEED Platinum certification.",
      category: "Residential",
      imageUrl:
        "https://images.pexels.com/photos/9321327/pexels-photo-9321327.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      client: "Lakeside Living",
      location: "Chicago, USA",
      year: "2022",
      published: true,
      sortOrder: 5,
    },
    {
      title: "Nordic Innovation Hub",
      slug: "nordic-innovation-hub",
      description:
        "A research facility designed with Scandinavian minimalism. The building features a timber structure, green roof, and fully integrated BIM management system.",
      category: "Commercial",
      imageUrl:
        "https://images.pexels.com/photos/19107852/pexels-photo-19107852.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      client: "Oslo Research Council",
      location: "Oslo, Norway",
      year: "2024",
      published: true,
      sortOrder: 6,
    },
  ]);

  // Team
  await db.insert(teamMembers).values([
    {
      name: "Alexandra Chen",
      role: "Principal Architect & Founder",
      bio: "With 20 years of experience in award-winning architecture, Alexandra leads the studio's design vision. She holds degrees from MIT and the AA School of Architecture.",
      sortOrder: 1,
    },
    {
      name: "Marcus Rivera",
      role: "Director of BIM",
      bio: "Marcus is a certified BIM manager who has coordinated over 100 complex projects. He specializes in computational design and digital twin technology.",
      sortOrder: 2,
    },
    {
      name: "Sarah Lindström",
      role: "Head of Interior Design",
      bio: "Sarah brings Scandinavian design sensibility to every project. Her interiors have been featured in Architectural Digest, Elle Décor, and Dwell.",
      sortOrder: 3,
    },
    {
      name: "James Okafor",
      role: "Sustainability Lead",
      bio: "James is a LEED AP and Passive House designer who ensures every project minimizes its environmental footprint while maximizing occupant comfort.",
      sortOrder: 4,
    },
  ]);

  // Admin user
  const hash = await bcrypt.hash("admin123", 10);
  await db.insert(adminUsers).values({
    email: "admin@arcform.studio",
    passwordHash: hash,
    name: "Admin",
  });
}
