import { Building, LocateFixed, Mountain, Trophy, Utensils } from 'lucide-react'
import colors from 'tailwindcss/colors'

export const Category = {
  LOCATE: 0,
  RESTAURANTS: 1,
  ATTRACTIONS: 2,
  CULTURE: 3,
  SPORTS: 4,
}

const MarkerCategories = {
  [Category.LOCATE]: {
    name: 'מיקום משתמש',
    icon: LocateFixed,
    color: colors.green[400],
    hideInMenu: true,
  },
  [Category.RESTAURANTS]: {
    name: 'מסעדות',
    icon: Utensils,
    color: colors.blue[400],
  },
  [Category.ATTRACTIONS]: {
    name: 'אטרקציות',
    icon: Mountain,
    color: colors.red[400],
  },
  [Category.CULTURE]: {
    name: 'תרבות',
    icon: Building,
    color: colors.purple[400],
  },
  [Category.SPORTS]: {
    name: 'ספורט',
    icon: Trophy,
    color: colors.yellow[400],
  },
}

export default MarkerCategories
