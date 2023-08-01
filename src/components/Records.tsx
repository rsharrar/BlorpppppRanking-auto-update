import { PlayerRecord } from '../lib/player'
import { useState } from 'react'

interface Props {
  records: PlayerRecord[]
}

export function Records({ records }: Props) {
  const [sortFunc, setSortFunc] = useState('RANK')
  const [sortDescending, setSortDescending] = useState(true)


  const rankFunc = (r: PlayerRecord) => r.opponent.colley_score
  const recordFunc = (r: PlayerRecord) => {
    return (1 + r.wins) / (2 + r.wins + r.losses)
  }

  const getSortFunc = (funcName: string) => {
    if(funcName === 'RANK') {
      return rankFunc 
    }
    return recordFunc
  }

  const sortedRecords = [...records].sort((a, b) => { 
    const f = getSortFunc(sortFunc)
    return sortDescending ?
    f(b) - f(a):
    f(a) - f(b)
  })

  const updateSort = (sortName: string) => {
    if(sortName === sortFunc) {
      setSortDescending(!sortDescending)
      return
    }
    setSortFunc(sortName)
    setSortDescending(true)
  }

  /*
   * c0, c1 initial color hexstring in RRGGBB
   * f interpolation fraction from 0 to 1
   */
  const interpolateColor = (c0: string, c1: string, f: number) => {
    const c0a = c0.match(/.{1,2}/g)
      .map((oct)=> parseInt(oct, 16) * (1-f))
    const c1a = c1.match(/.{1,2}/g)
      .map((oct)=> parseInt(oct, 16) * f)
    const ci = [0,1,2].map(i => Math.min(Math.round(c0a[i] + c1a[i]), 255))
    return ci.reduce((a,v) => ((a << 8) + v), 0).toString(16).padStart(6, "0")
  }

  const getBgColor = (r: PlayerRecord) => {
    const green = "16A34A"
    const yellow = "FEF9C3"
    const red = "DC2626"
    const score = recordFunc(r)
    if (score >= 0.5) {
      return interpolateColor(yellow, green, (score - 0.5) * 2) // fit to scale
    }
    return interpolateColor(red, yellow, score*2) // fit to scale
  }
  

    return <div>
      <div className="flex flex-col items-center mb-2 pt-2">
        <div className="uppercase p-1 text-xs font-bold"> Sort by </div>
        <div className="flex flex-row items-center justify-center">
          <button
          type="button"
          className="m-2 inline-block rounded-full border-2 border-blue-500 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-blue-500 transition duration-150 ease-in-out hover:border-blue-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-blue-600 focus:border-blue-600 focus:text-blue-600 focus:outline-none focus:ring-0 active:border-blue-700 active:text-blue-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
          onClick={() => updateSort('RANK')} >
            Opponent Rank
          </button>
          <button
          type="button"
          className="m-2 inline-block rounded-full border-2 border-teal-500 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-teal-500 transition duration-150 ease-in-out hover:border-teal-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-teal-600 focus:border-teal-600 focus:text-teal-600 focus:outline-none focus:ring-0 active:border-teal-700 active:text-teal-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
          onClick={() => updateSort('RECORD')} >
            Record
          </button>
        </div>
      </div>

      {sortedRecords.map((r) => {
        return <div key={r.opponent.name} style={{backgroundColor: "#" + getBgColor(r)}} className={`px-2 py-1`}>
          <span className="font-bold text-green-700">{r.wins}</span> - <span className="font-bold text-red-700">{r.losses}</span> vs. #{r.opponent.colley_rank} {r.opponent.name}
        </div>})}
    </div>
  }
