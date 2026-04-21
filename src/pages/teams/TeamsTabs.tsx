export type TeamsTabKey = 'all' | 'favorites'

interface TeamsTabsProps {
  activeTab: TeamsTabKey
  allCount: number
  favoritesCount: number
  onTabChange: (tab: TeamsTabKey) => void
}

export const TeamsTabs = ({ activeTab, allCount, favoritesCount, onTabChange }: TeamsTabsProps) => {
  return (
    <div className="flex w-full items-center">
      <button
        type="button"
        onClick={() => onTabChange('all')}
        className={`h-full w-full cursor-pointer py-2 text-sm ${activeTab === 'all' ? 'border-primary border-b-2 text-white font-semibold' : 'text-muted border-secondary/50 border-b'}`}
      >
        {`Ver Todos (${allCount})`}
      </button>
      <button
        type="button"
        onClick={() => onTabChange('favorites')}
        className={`h-full w-full cursor-pointer py-2 text-sm ${activeTab === 'favorites' ? 'border-primary border-b-2 text-white font-semibold' : 'text-muted border-secondary/50 border-b'}`}
      >
        {`Favoritos (${favoritesCount})`}
      </button>
    </div>
  )
}
