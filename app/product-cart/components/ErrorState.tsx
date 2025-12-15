export default function ErrorState({ message }: { message?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border p-6 text-red-600">
      {message ?? "خطایی رخ داد."}
    </div>
  );
}
