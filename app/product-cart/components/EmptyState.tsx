export default function EmptyState({ text }: { text?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border p-6 text-gray-500">
      {text ?? "موردی برای نمایش نیست."}
    </div>
  );
}
