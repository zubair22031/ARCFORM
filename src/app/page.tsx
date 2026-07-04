import { db } from "@/db";
import { siteSettings, services, projects, teamMembers } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getServiceIcon } from "@/components/icons";
import ContactForm from "@/components/ContactForm";
import Navbar from "@/components/Navbar";
import { seedDatabase } from "@/lib/seed";

export const dynamic = "force-dynamic";

async function getSettings() {
  try {
    await seedDatabase();
  } catch {
    // ignore if already seeded
  }
  const rows = await db.select().from(siteSettings);
  const s: Record<string, string> = {};
  for (const r of rows) s[r.key] = r.value;
  return s;
}

export default async function HomePage() {
  const s = await getSettings();
  const svcList = await db
    .select()
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.sortOrder));
  const projList = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.sortOrder));
  const team = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.published, true))
    .orderBy(asc(teamMembers.sortOrder));

  return (
    <main className="min-h-screen">
      <Navbar siteName={s.site_name || "ARCFORM"} />

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.pexels.com/photos/15577446/pexels-photo-15577446.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=2000)`,
          }}
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <p className="text-arch-accent tracking-[0.3em] uppercase text-sm mb-6 font-medium">
            {s.site_tagline || "Architecture · Design · BIM"}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-white leading-tight mb-8 whitespace-pre-line">
            {s.hero_title || "Shaping Spaces\nThat Inspire"}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {s.hero_subtitle || ""}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#projects"
              className="px-8 py-4 bg-arch-accent text-white font-medium tracking-wide hover:bg-arch-accent-dark transition-colors"
            >
              View Our Work
            </a>
            <a
              href="#contact"
              className="px-8 py-4 border border-white/30 text-white font-medium tracking-wide hover:bg-white/10 transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-arch-accent tracking-[0.2em] uppercase text-sm mb-4 font-medium">
                About Us
              </p>
              <h2 className="text-4xl md:text-5xl font-display text-arch-black mb-8 leading-tight">
                {s.about_title || "We Design The Future"}
              </h2>
              <p className="text-arch-mid text-lg leading-relaxed mb-8">
                {s.about_text || ""}
              </p>
              <a
                href="#services"
                className="inline-flex items-center gap-2 text-arch-accent font-medium hover:gap-4 transition-all"
              >
                Explore Our Services
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[
                { num: s.about_stat_1_number || "200+", label: s.about_stat_1_label || "Projects" },
                { num: s.about_stat_2_number || "15+", label: s.about_stat_2_label || "Years" },
                { num: s.about_stat_3_number || "50+", label: s.about_stat_3_label || "Team" },
              ].map((stat, i) => (
                <div key={i} className="text-center p-6 bg-arch-cream">
                  <div className="text-3xl md:text-4xl font-display text-arch-black mb-2">
                    {stat.num}
                  </div>
                  <div className="text-arch-mid text-sm tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-arch-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-arch-accent tracking-[0.2em] uppercase text-sm mb-4 font-medium">
              What We Do
            </p>
            <h2 className="text-4xl md:text-5xl font-display text-arch-black">
              Our Services
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {svcList.map((svc) => (
              <div
                key={svc.id}
                className="bg-white p-8 group hover:bg-arch-black transition-colors duration-500"
              >
                <div className="w-12 h-12 text-arch-accent mb-6 group-hover:text-arch-accent transition-colors">
                  {getServiceIcon(svc.icon, "w-12 h-12")}
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors">
                  {svc.title}
                </h3>
                <p className="text-arch-mid group-hover:text-gray-400 transition-colors leading-relaxed">
                  {svc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-arch-accent tracking-[0.2em] uppercase text-sm mb-4 font-medium">
              Portfolio
            </p>
            <h2 className="text-4xl md:text-5xl font-display text-arch-black">
              Featured Projects
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projList.map((proj) => (
              <div key={proj.id} className="group cursor-pointer">
                <div className="relative overflow-hidden aspect-[4/3] mb-4">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-end">
                    <div className="p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-arch-accent text-sm tracking-wider uppercase">
                        {proj.category}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">{proj.title}</h3>
                <div className="flex items-center gap-3 text-arch-mid text-sm">
                  {proj.location && <span>{proj.location}</span>}
                  {proj.year && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-arch-mid" />
                      <span>{proj.year}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-arch-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-arch-accent tracking-[0.2em] uppercase text-sm mb-4 font-medium">
              Our People
            </p>
            <h2 className="text-4xl md:text-5xl font-display">
              Meet The Team
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.id} className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-arch-gray flex items-center justify-center text-3xl font-display text-arch-accent">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-arch-accent text-sm mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-arch-accent tracking-[0.2em] uppercase text-sm mb-4 font-medium">
                Contact
              </p>
              <h2 className="text-4xl md:text-5xl font-display text-arch-black mb-8">
                Let&apos;s Build Something Together
              </h2>
              <p className="text-arch-mid text-lg leading-relaxed mb-10">
                Have a project in mind? We&apos;d love to hear from you. Reach out and
                let&apos;s discuss how we can bring your vision to life.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-arch-cream flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-arch-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-arch-mid uppercase tracking-wide mb-1">Email</div>
                    <div className="font-medium">{s.contact_email || "hello@arcform.studio"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-arch-cream flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-arch-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-arch-mid uppercase tracking-wide mb-1">Phone</div>
                    <div className="font-medium">{s.contact_phone || ""}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-arch-cream flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-arch-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-arch-mid uppercase tracking-wide mb-1">Address</div>
                    <div className="font-medium whitespace-pre-line">{s.contact_address || ""}</div>
                  </div>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-arch-black text-gray-500 text-center text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <p>{s.footer_text || "© 2025 ARCFORM. All rights reserved."}</p>
        </div>
      </footer>
    </main>
  );
}
