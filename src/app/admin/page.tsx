import UploadProject from "@/components/UploadProject";
import ProjectList from "@/components/ProjectList";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-5xl font-bold mb-3">
          Admin Dashboard
        </h1>

        <p className="text-zinc-400 mb-10">
          Upload and manage your projects
        </p>

        <UploadProject />

        <ProjectList />

      </div>

    </main>
  );
}