import type { Metadata } from 'next'
import BlogShell from '@/components/BlogShell'
import { BLOG_POSTS } from '@/lib/blog'
import { SITE_NAME, SITE_URL } from '@/lib/site'

const SLUG = 'best-forex-trading-courses-dubai'
const POST = BLOG_POSTS.find((p) => p.slug === SLUG)!
const PATH = `/blog/${SLUG}`

const META_DESCRIPTION =
  'Compare forex trading courses in Dubai for 2026: format, course length and who each suits, plus red flags to avoid before you pay. Published by Delta Trading Academy.'

export const metadata: Metadata = {
  title: POST.title,
  description: META_DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: POST.title,
    description: META_DESCRIPTION,
    url: PATH,
    siteName: SITE_NAME,
    type: 'article',
    publishedTime: POST.published,
    modifiedTime: POST.modified,
    authors: [SITE_NAME],
  },
  twitter: { card: 'summary', title: POST.title, description: META_DESCRIPTION },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'How much does a forex trading course cost in Dubai?',
    a: 'Most classroom forex courses listed in Dubai cost between roughly AED 2,000 and AED 6,000. Longer professional programmes can cost more. The price usually depends on course hours, class size and whether mentoring continues after the course.',
  },
  {
    q: 'How long does it take to learn forex trading?',
    a: 'A beginner course usually runs from about 12 to 30 hours. Becoming consistent takes much longer: expect several months of practice on a demo account before you risk real money.',
  },
  {
    q: 'Is forex trading legal in the UAE?',
    a: "Yes. Use a broker licensed by a UAE regulator, such as the SCA, or the DFSA for firms in the DIFC. Learning forex at a training institute is a separate thing: the institute teaches, it doesn't hold your money.",
  },
  {
    q: 'What does KHDA-approved mean for a trading course?',
    a: "KHDA, the Knowledge and Human Development Authority, licenses private training centres in Dubai. A KHDA-approved institute is allowed to run courses. It doesn't mean the institute's trading advice is endorsed.",
  },
  {
    q: 'Do I need a finance background to learn forex?',
    a: 'No. Good beginner courses assume you know nothing about markets. Basic maths and patience matter more than a finance degree.',
  },
  {
    q: 'Can I learn forex for free instead?',
    a: 'You can learn the basics free from broker tutorials and YouTube. A paid course adds structure, a teacher who checks your mistakes, and a fixed schedule that keeps you going.',
  },
]

const ORG = { '@type': 'Organization', name: SITE_NAME, url: SITE_URL }

const ARTICLE_LD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: POST.title,
  description: POST.description,
  datePublished: POST.published,
  dateModified: POST.modified,
  mainEntityOfPage: `${SITE_URL}${PATH}`,
  author: ORG,
  publisher: ORG,
}

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

/* Escape "<" so the JSON can never close the script tag (per the Next.js JSON-LD guide). */
const ld = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') })

const WA_CONSULT =
  'https://wa.me/971507528009?text=Hi%2C%20I%20read%20your%20forex%20course%20comparison%20and%20would%20like%20a%20free%20consultation.'

/* ── tiny style helpers ── */
const H2 = 'text-[22px] md:text-[27px] font-normal tracking-[-0.015em] leading-[1.2] mt-12 mb-4'
const H3 = 'text-[17px] md:text-[19px] font-medium tracking-[-0.01em] leading-[1.3] mt-8 mb-2'
const P = 'text-[15.5px] text-black/70 leading-[1.8] mb-4'
const LI = 'flex items-start gap-2.5 text-[15.5px] text-black/70 leading-[1.75]'
const DOT = <span className="mt-[11px] w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0" aria-hidden />

function Bullets({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-2.5 mb-5">{children}</ul>
}

export default function ForexCoursesDubaiPage() {
  return (
    <BlogShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(ARTICLE_LD)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(FAQ_LD)} />

      <article className="max-w-[760px] mx-auto px-6 md:px-8 py-12 md:py-16">
        <h1 className="text-[30px] md:text-[42px] font-normal tracking-[-0.025em] leading-[1.1] mb-3">
          Best Forex Trading Courses in Dubai (2026): An Honest Comparison
        </h1>
        <p className="text-[13px] text-black/40 mb-8">
          Last updated: <time dateTime={POST.modified}>20 November 2026</time>
        </p>

        <div className="rounded-2xl bg-black/[0.03] border border-black/[0.07] px-5 py-5 mb-8">
          <p className="text-[15.5px] text-black/75 leading-[1.75]">
            <strong className="font-semibold text-black">Quick answer:</strong> The best forex trading course in Dubai depends on how you learn. Pick a KHDA-approved institute that publishes its syllabus, lets you practise with live markets, and never promises profits. Delta Trading Academy is a KHDA-approved academy in Dubai running a 6 to 8-week forex programme, in class or online. Online Trading Academy Dubai, EduDelphi, Edoxi, FXCareers Global and Moneytize are other established options. They differ mainly in course length and format.
          </p>
        </div>

        <p className={P}>
          Scroll through Instagram in Dubai for five minutes and you&apos;ll see it. A guy in a rented Lamborghini, a laptop full of green candles, and a caption about &quot;financial freedom.&quot; It&apos;s no wonder so many people here want to learn forex. It&apos;s also no wonder so many end up paying for the wrong course.
        </p>
        <p className={P}>
          We run a trading academy in Dubai, so yes, we have skin in this game. That&apos;s exactly why we wrote this. Many students we meet have spent weeks comparing courses and still aren&apos;t sure what to look for. This guide is the conversation we&apos;d want every student to have first.
        </p>
        <p className={P}>
          Below you&apos;ll find a side-by-side look at well-known forex courses in Dubai, including ours, plus the questions worth asking before you hand over any money.
        </p>

        <h2 className={H2}>Forex courses in Dubai at a glance</h2>
        <p className={P}>Fees change often, so confirm the current price directly with each academy before you enrol.</p>

        <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 mb-6">
          <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-black/15">
                <th scope="col" className="py-3 pr-4 font-medium text-black">Academy</th>
                <th scope="col" className="py-3 pr-4 font-medium text-black">Format</th>
                <th scope="col" className="py-3 pr-4 font-medium text-black">Course length</th>
                <th scope="col" className="py-3 font-medium text-black">Best suited for</th>
              </tr>
            </thead>
            <tbody className="text-black/70 align-top">
              {[
                ['Delta Trading Academy', 'Classroom in Dubai and live online', '6 to 8 weeks; weekend or weekday batches', 'Beginner, intermediate and advanced traders who want live-market practice and mentor support'],
                ['Online Trading Academy Dubai', 'Classroom at Dubai Knowledge Park, plus live and on-demand online', 'Varies by asset class', 'Learners who want a long-running international brand covering several markets'],
                ['EduDelphi', 'Classroom near BurJuman, live online or self-paced', '20+ guided hours', 'Beginners who want a short, risk-focused introduction'],
                ['Edoxi Training Institute', 'Classroom near BurJuman or live online', '24 hours, with evening sessions', 'Working professionals who want a short course after work'],
                ['FXCareers Global', 'Classroom, Dubai', '30-hour modules, up to a 90-hour programme', 'Learners who want a long, fixed curriculum'],
                ['Moneytize', 'Classroom in Dubai, online', 'Level 1 and Level 2', 'Working professionals who want a short, staged start'],
              ].map(([name, format, length, fit]) => (
                <tr key={name} className="border-b border-black/[0.08]">
                  <th scope="row" className="py-3.5 pr-4 font-medium text-black">{name}</th>
                  <td className="py-3.5 pr-4 leading-[1.55]">{format}</td>
                  <td className="py-3.5 pr-4 leading-[1.55]">{length}</td>
                  <td className="py-3.5 leading-[1.55]">{fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className={H2}>How we compared them</h2>
        <p className={P}>We ignored the marketing and looked at five things a student can actually check:</p>
        <ol className="flex flex-col gap-2.5 mb-5 list-decimal pl-5 marker:text-black/40">
          <li className="text-[15.5px] text-black/70 leading-[1.75] pl-1"><strong className="font-semibold text-black">Approval:</strong> Is the institute approved by KHDA, Dubai&apos;s education regulator? An approved centre has a licence to teach, which is different from a licence to trade or manage money.</li>
          <li className="text-[15.5px] text-black/70 leading-[1.75] pl-1"><strong className="font-semibold text-black">Transparency:</strong> Does the academy publish its syllabus, duration and fees, or is everything &quot;call us&quot;?</li>
          <li className="text-[15.5px] text-black/70 leading-[1.75] pl-1"><strong className="font-semibold text-black">Practice:</strong> Do you analyse live markets during the course, or just watch slides?</li>
          <li className="text-[15.5px] text-black/70 leading-[1.75] pl-1"><strong className="font-semibold text-black">Support after the course:</strong> Is there mentoring, revision classes or a community, or does it end on the last day?</li>
          <li className="text-[15.5px] text-black/70 leading-[1.75] pl-1"><strong className="font-semibold text-black">Honesty about risk:</strong> Does the academy talk openly about losses, or only about profits?</li>
        </ol>

        <h2 className={H2}>The academies, one by one</h2>

        <h3 className={H3}>Delta Trading Academy</h3>
        <p className={P}>
          We&apos;ll start with ourselves and keep it factual. Delta Trading Academy is a KHDA-approved training institute in Dubai. Our flagship Forex Trading Programme takes students from beginner to advanced level in about 6 to 8 weeks. You can join a weekend-intensive batch or a flexible weekday batch, in class at our Dubai campus or live online.
        </p>
        <p className={P}>
          The programme covers four things: technical analysis, risk management, trading psychology and live market analysis. That last part matters. Instead of only watching slides, students analyse real markets in live sessions with a mentor. Everyone who completes the programme receives a certificate.
        </p>
        <p className={P}>A few things students often ask about:</p>
        <Bullets>
          <li className={LI}>{DOT}<span><strong className="font-semibold text-black">Who teaches:</strong> a team of market analysts and mentors, including senior market analyst Praveen Pathiyil, who has over 11 years of market experience. Mentors teach in more than five languages.</span></li>
          <li className={LI}>{DOT}<span><strong className="font-semibold text-black">After the course:</strong> students can continue with one-to-one mentorship or the ongoing live mentorship programme.</span></li>
          <li className={LI}>{DOT}<span><strong className="font-semibold text-black">Track record:</strong> over 7,000 students trained, and a 4.9-star rating from 518+ Google reviews (as of November 2026).</span></li>
          <li className={LI}>{DOT}<span><strong className="font-semibold text-black">A fun one:</strong> Delta holds a Guinness World Record for the most nationalities in a single trading lesson.</span></li>
        </Bullets>
        <p className={P}>
          <strong className="font-semibold text-black">Good fit if:</strong> you&apos;re a beginner starting from zero, or an intermediate or advanced trader looking to sharpen your skills, and you want hands-on, live-market practice with a mentor checking your work, and a schedule that works around a full-time job.
        </p>

        <h3 className={H3}>Other academies worth knowing</h3>
        <p className={P}><strong className="font-semibold text-black">Online Trading Academy Dubai</strong> is the Dubai franchise of a US trading school and has taught in the city for over 20 years. Classes run at Dubai Knowledge Park, with live and on-demand online sessions. It suits learners who want one academy for forex, stocks, futures and options.</p>
        <p className={P}><strong className="font-semibold text-black">EduDelphi</strong> is a KHDA-approved training centre near BurJuman Metro. Its forex course runs 20+ guided hours in class, live online or self-paced, and focuses on risk and market basics.</p>
        <p className={P}><strong className="font-semibold text-black">Edoxi Training Institute</strong> is also near BurJuman Metro. Its 24-hour forex course runs in class or live online, with evening sessions that suit people working full-time.</p>
        <p className={P}><strong className="font-semibold text-black">FXCareers Global</strong> is a classroom-based institute on Sheikh Zayed Road. It suits learners who want a long, fixed curriculum, with 30-hour modules that build up to a 90-hour programme.</p>
        <p className={P}><strong className="font-semibold text-black">Moneytize</strong> is based in Al Quoz and teaches in levels, paced for people with full-time jobs. It also covers stocks.</p>

        <h2 className={H2}>Red flags to watch for before you pay</h2>
        <p className={P}>A good course can feel a little boring compared with the hype. That&apos;s usually a good sign. Walk away if you hear any of these:</p>
        <Bullets>
          <li className={LI}>{DOT}<span><strong className="font-semibold text-black">&quot;You&apos;ll make your fees back in a month.&quot;</strong> No honest teacher can promise returns. Most new traders lose money while they learn.</span></li>
          <li className={LI}>{DOT}<span><strong className="font-semibold text-black">&quot;Pay after you&apos;re profitable.&quot;</strong> It sounds generous, so ask exactly how payment works and whether you must trade through a particular broker.</span></li>
          <li className={LI}>{DOT}<span><strong className="font-semibold text-black">No syllabus, no address, no named teachers.</strong> If everything is &quot;DM us,&quot; ask yourself why.</span></li>
          <li className={LI}>{DOT}<span><strong className="font-semibold text-black">Pressure to enrol today.</strong> A real academy will still be there next week.</span></li>
        </Bullets>
        <p className={P}>Before you pay, ask three questions: Is the institute KHDA-approved? Will I practise on real market charts during the course? Who exactly will teach me, and can I see their background?</p>

        <h2 className={H2}>Frequently asked questions</h2>
        {FAQS.map(({ q, a }) => (
          <div key={q}>
            <h3 className={H3}>{q}</h3>
            <p className={P}>{a}</p>
          </div>
        ))}

        <h2 className={H2}>The bottom line</h2>
        <p className={P}>
          There&apos;s no single best forex course in Dubai, only the best one for how you learn. Choose an approved institute that shows you its syllabus, gives you real market practice, and is honest that trading is risky. If that sounds like what you&apos;re after, book a free consultation with Delta Trading Academy and we&apos;ll help you find the right batch.
        </p>

        <a
          href={WA_CONSULT}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#0f0e0c] text-white text-[14px] px-7 py-3.5 rounded-full hover:bg-[#2a2825] transition-colors mt-2 mb-10"
        >
          Book a free consultation <span className="text-[12px]" aria-hidden>→</span>
        </a>

        <p className="text-[12.5px] text-black/45 leading-[1.7] border-t border-black/[0.07] pt-6">
          <em>Disclosure: This article is published by Delta Trading Academy. We&apos;ve described other academies using their own public listings and kept the comparison as fair as we can. Trading forex involves significant risk of loss. This article is educational and is not financial advice. Completing any course does not guarantee trading results.</em>
        </p>
      </article>
    </BlogShell>
  )
}
