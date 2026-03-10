import { Job } from "@/lib/scraper";
import ApplySection from "./ApplySection";

async function getJob(slug: string): Promise<Job | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/jobs/${slug}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400 text-lg">Job not found</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <a
          href="/jobs"
          className="text-emerald-400 hover:text-emerald-300 text-sm font-medium mb-8 inline-block"
        >
          &larr; Back to Jobs
        </a>

        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {job.title}
          </h1>
          <span className="bg-emerald-500/20 text-emerald-400 text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap mt-1">
            {job.roleType}
          </span>
        </div>

        <p className="text-slate-300 text-lg mb-8">{job.company}</p>

        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { icon: "\ud83d\udcc5", value: job.weekly_hours },
            { icon: "\ud83d\udcb0", value: job.comp_range },
            { icon: "\ud83c\udfe2", value: job.company_stage },
            { icon: "\ud83c\udfed", value: job.industry },
            { icon: "\ud83d\udccd", value: job.location },
          ].map((item, i) => (
            <span
              key={i}
              className="bg-slate-800 text-slate-200 text-sm px-4 py-2 rounded-full"
            >
              {item.icon} {item.value || "\u2014"}
            </span>
          ))}
        </div>

        {job.description && (
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-slate-300 whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </div>
        )}

        <ApplySection jobId={job.id!} />
      </div>
    </main>
  );
}
