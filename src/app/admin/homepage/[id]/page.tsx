import AdminHomepageEditor from "@/components/admin/AdminHomepageEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditHomepageSectionPage({ params }: Props) {
  const { id } = await params;
  return <AdminHomepageEditor id={id} />;
}
