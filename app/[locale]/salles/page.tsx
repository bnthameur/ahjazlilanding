import { redirect } from 'next/navigation';

export default function SallesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  redirect(`https://app.ahjazliqaati.com/${locale}/salles`);
}
