import { Dashboard, Football, Calendar, Dollar } from '@boxicons/react'
import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', icon: Dashboard, label: 'Dashboard' },
  { to: '/matches', icon: Calendar, label: 'Partidos' },
  { to: '/bets', icon: Dollar, label: 'Apuestas' },
  { to: '/teams', icon: Football, label: 'Equipos' },
]

export const BottomNav = () => {
  return (
    <div className="safe-area-bottom bg-secondary-dark fixed right-0 bottom-0 left-0 z-50 h-15">
      <div className="flex h-full items-center">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors ${
                isActive ? 'text-primary' : 'text-foreground hover:text-primary'
              }`
            }
          >
            <Icon size="sm" />
            <p className="text-xs">{label}</p>
          </NavLink>
        ))}
      </div>
    </div>
  )
}
