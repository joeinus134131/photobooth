import { ShareView } from '@/components/share/ShareView'

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ShareView shareId={id} />
}
