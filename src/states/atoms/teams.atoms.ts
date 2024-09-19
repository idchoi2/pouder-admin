import { teams } from '@prisma/client'
import { atom } from 'recoil'

export const currentTeamAtom = atom<teams | null>({
  key: 'currentTeam',
  default: null,
})
