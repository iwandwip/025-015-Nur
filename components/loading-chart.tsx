export default function LoadingChart() {
  return (
    <div className="h-80 w-full flex items-center justify-center">
      <div className="animate-pulse flex space-x-4 w-full">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}