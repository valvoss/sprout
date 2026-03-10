import { Job } from "@/lib/scraper";

const ROLE_TYPES = ["All", "CFO", "CMO", "COO", "CTO"] as const;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

async function getJobs(): Promise<Job[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/jobs`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 flex flex-col gap-3 hover:bg-slate-800/80 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">{job.title}</h3>
          <p className="text-slate-300 text-sm">{job.company}</p>
        </div>
        <span className="bg-emerald-500/20 text-emerald-400 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
          {job.roleType}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-400">
        <span>{job.location}</span>
        <span className="text-slate-600">·</span>
        <span>{timeAgo(job.posted_at)}</span>
        <span className="text-slate-600">·</span>
        <span>{job.source}</span>
      </div>

      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center justify-center px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors text-sm w-fit"
      >
        View role
      </a>
    </div>
  );
}

function FilterBar() {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {ROLE_TYPES.map((role) => (
        <button
          key={role}
          data-role={role}
          className="filter-btn bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium px-4 py-2 rounded-full transition-colors data-[active]:bg-emerald-500 data-[active]:text-white"
        >
          {role}
        </button>
      ))}
    </div>
  );
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <main className="min-h-screen bg-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-100 text-sm font-medium">Live feed</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Live Fractional <span className="text-emerald-500">Jobs</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Actively posted roles from across the fractional exec market
          </p>
        </div>

        {/* Filter + Jobs — client-side filtering via script */}
        <FilterBar />

        {jobs.length > 0 ? (
          <div id="jobs-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job, i) => (
              <div key={i} data-role-type={job.roleType}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-slate-400 text-lg">
              Check back soon — new roles posted daily
            </p>
          </div>
        )}
      </div>

      {/* Client-side filter script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var btns = document.querySelectorAll('.filter-btn');
              var cards = document.querySelectorAll('#jobs-grid > div');
              var active = 'All';

              function update() {
                btns.forEach(function(b) {
                  if (b.dataset.role === active) b.setAttribute('data-active', '');
                  else b.removeAttribute('data-active');
                });
                cards.forEach(function(c) {
                  c.style.display = (active === 'All' || c.dataset.roleType === active) ? '' : 'none';
                });
              }

              btns.forEach(function(b) {
                b.addEventListener('click', function() {
                  active = b.dataset.role;
                  update();
                });
              });

              update();
            })();
          `,
        }}
      />
    </main>
  );
}
