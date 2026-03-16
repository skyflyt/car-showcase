import { AdminCarForm } from "@/components/AdminCarForm";

export default function NewCarPage() {
  return (
    <div>
      <h1 className="text-2xl font-light tracking-tight mb-8">
        Add <span className="font-semibold">New Car</span>
      </h1>
      <AdminCarForm />
    </div>
  );
}
