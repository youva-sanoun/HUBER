import { Notes } from "@/components/notes/notes";
import { PageHeader } from "@/components/page-header";

export default function NotesPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Notes" description="" />
      <Notes />
    </div>
  );
}
