const skeletonIds = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10']

export const BetsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 items-center gap-3 py-8">
      {skeletonIds.map((id) => (
        <div key={id} className="skeleton-shimmer relative h-30 rounded-lg" />
      ))}
    </div>
  )
}
