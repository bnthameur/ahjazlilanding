import { redirect } from 'next/navigation';

export default function RegisterRedirect({
  params: { locale },
}: {
  params: { locale: string };
}) {
  redirect(`https://app.ahjazliqaati.com/${locale}/register`);
}
