import { Player } from '../lib/player'
import { Character } from './Character'
import { Records } from './Records'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/solid'

interface Props {
  player: Player
}

export function Row({ player }: Props) {

  const codeToId = (code: string) => {
    const parts = code.split('#')
    return `${parts[0].toLowerCase()}-${parts[1]}`
  }

  const playerToUrlSlug = (playerToUrlSlug: string) => {
    // TODO
    return ""
  }

  const changeIndicator = (change: number, indicators: string[]) => {
    return <span className={`px-1 md:text-sm text-xs ${change > 0 ? 'text-green-500': 'text-red-500'}`}>
     {change > 0? indicators[0]: indicators[1]}{Math.abs(change)}
   </span>
  }

  const changeArrow = (change: number) => {
    return changeIndicator(change, ['▲ ', '▼ '])
  }

  const changePlusMinus = (change: number) => {
    return changeIndicator(change, ['+', '-'])
  }

  const totalSets = player.records.reduce((acc, r) => acc + r.wins + r.losses, 0)
  const totalWins = player.records.reduce((acc, r) => acc + r.wins, 0)
  const totalLosses = player.records.reduce((acc, r) => acc + r.losses, 0)
  const getTableBg = (player: Player) => {
    if(player.colley_rank <= 10) {
      return "bg-slate-900"
    }
    if(player.colley_rank <= 20) {
      return "bg-blue-900"
    }
    if(player.colley_rank <= 30) {
      return "bg-sky-900"
    }
    if(player.colley_rank <= 40) {
      return "bg-yellow-900"
    }
    if(player.colley_rank <= 50) {
      return "bg-slate-800"
    }
    return "bg-orange-900"
  }

  const formatScore = (score: number) => {
    return Math.floor(score * 1000) / 1000
  }

  const records = player.player_records
    .sort((a, b) => a.opponent.colley_rank - b.opponent.colley_rank)


  return (
		  <Disclosure>
       {({ open }) => (
         <>
           <Disclosure.Button className={`${open ? 'rounded-t-lg' : 'rounded-lg '}`}>
              <div className={`${getTableBg(player)} flex flex-row border-separate border-spacing-1 border-b-2 border-gray-600 items-center justify-center p-3`}>
                <div className="md:w-20 w-10 md:text-2xl text-gray-300 whitespace-nowrap text-center">
                  #{player.colley_rank}
	          	   </div>
                <div className="flex flex-row md:w-64 w-40 text-gray-100 whitespace-nowrap text-center overflow-hidden md:max-w-full max-w-[7rem] text-elipses md:text-xl text-sm max-w-xs text-gray-300 items-center justify-center">
                  {player.name}
                  <div className="mx-1 flex flex-row">
                  {(player.characters ?? []).map((c) => {
                    return <Character key={c} name={c} />
                  })}
                  </div>
                </div>
                <div className="md:w-40 w-20 md:text-xl text-sm text-gray-100 whitespace-nowrap text-center">
                  {formatScore(player.colley_score)}
                </div>
                <div className="md:w-44 w-20 md:text-lg text-sm text-gray-100 whitespace-nowrap text-center">
                  <span className="text-gray-400 mr-2">#{player.colley_strength_of_schedule_rank}</span> {formatScore(player.colley_strength_of_schedule)}
                </div>
                <div className="md:w-20 w-10 md:text-xl text-gray-300 text-sm whitespace-nowrap text-center">
                  {Boolean(totalSets) && <><span className="text-green-500">{totalWins}</span><span className="md:p-1">/</span>
                  <span className="text-red-500">{totalLosses}</span>
                </>}
                </div>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-gray-100`}
                />
            </div>
           </Disclosure.Button>
		  	<Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0">
           <Disclosure.Panel className="bg-slate-100 rounded-b-lg mb-1">
             <Records records={player.player_records} />
           </Disclosure.Panel>
		    </Transition>
         </>
       )}
      </Disclosure>
  );
}
