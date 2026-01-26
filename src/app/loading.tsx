import CosmicLoader from '@/components/CosmicLoader';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[--bg-starry]">
      <CosmicLoader />
    </div>
  );
}
