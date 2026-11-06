import { redirect } from 'next/navigation';

// Old /admin path — permanently redirect to /administration
export default function OldAdminRedirect() {
  redirect('/administration');
}
