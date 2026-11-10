import { redirect } from 'next/navigation';

// Redirect legacy /admin/* subpaths to /administration/*
export default function OldAdminSubrouteRedirect({
  params,
}: {
  params: { slug: string[] };
}) {
  const target = params.slug?.length ? `/administration/${params.slug.join('/')}` : '/administration';
  redirect(target);
}
