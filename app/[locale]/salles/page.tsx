import { redirect } from 'next/navigation';

export default function SallesRedirect({
  params: { locale },
}: {
  params: { locale: string };
}) {
  redirect('/#explore');
}
