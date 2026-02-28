import { redirect } from 'next/navigation';

export default function LoginRedirect({
  params: { locale },
}: {
  params: { locale: string };
}) {
  redirect(`https://app.ahjazliqaati.com/${locale}/login`);
}
