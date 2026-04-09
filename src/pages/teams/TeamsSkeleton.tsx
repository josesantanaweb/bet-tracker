const skeletonIds = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10']

export const TeamsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 items-center gap-3 py-8">
      {skeletonIds.map((id) => (
        <div key={id} className="relative h-28 rounded-xl skeleton-shimmer" />
      ))}
    </div>
  )
}
