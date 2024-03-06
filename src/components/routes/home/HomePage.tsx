import React, { useEffect, useState } from 'react';
import { Table } from '../../Table';
import { Player } from '../../../lib/player'
import H1_2024_players from '../../../../cron/data/B3B6A4C9-4C45-49B5-BC3E-97BFC07566E4/players.json';
import H2_2023_players from '../../../../cron/data/1B2D2093-284F-4B5F-A1A7-F33814FCCBDE/players.json';
import * as settings from '../../../../settings'

const PLAYER_TO_CHARACTERS = new Map([
  ['Owl', ['MARTH']],
  ['ICEBOX | Kacey', ['FALCO', 'SHEIK']],
  ['DayDream', ['JIGGLYPUFF']],
  ['Fizzwiggle', ['SHEIK']],
  ['Polear', ['MARTH']],
  ['Miyagi', ['FOX']],
  ['DD', ['JIGGLYPUFF']],
  ['O2 | | Sayren', ['FALCO']],
  ['GetCrabby', ['MARTH']],
  ['James Jr.', ['FOX']],
  ['Zealot', ['FOX', 'SHEIK', 'MARTH', 'FALCO']],
  ['Loam', ['FALCO']],
  ['LIAM#697 | Shleeum', ['FOX', 'FALCO', 'MARTH']],
  ['DSJ', ['JIGGLYPUFF']],
  ['Big Piney', ['JIGGLYPUFF']],
  ['LT | RanD', ['LUIGI']],
  ['Conman', ['FOX']],
  ['Neuron', ['FOX']],
  ['Rafael', ['PEACH']],
  ['Tips', ['CAPTAIN_FALCON', 'NESS']],
  ['Omegam', ['SHEIK']],
  ['w0mp', ['FOX']],
  ['RIZ', ['FOX']],
  ['Grillindude', ['SAMUS']],
  ['Rrob', ['FOX']],
  ['blorppppp', ['SHEIK']],
  ['Dr | Pill Nye', ['DR_MARIO', 'DONKEY_KONG']],
  ['Kiefer', ['SHEIK']],
  ['3rd Strongest', ['FOX']],
  ['WizP', ['SHEIK', 'FOX']],
  ['KB | ChucklesTheCheat', ['FALCO']],
  ['Quest', ['FOX']],
  ['Stinky', ['LUIGI']],
  ['Jab', ['CAPTAIN_FALCON']],
  ['Gingerham', ['FOX']],
  ['Spin', ['FALCO']],
  ['PkThundah', ['ICE_CLIMBERS']],
  ['elel', ['FOX']],
  ['foxtrot', ['SHEIK']],
  ['Slatty', ['MARTH']],
  ['Wheels', ['FOX', 'FALCO']],
  ['Cheunk', ['PEACH']],
  ['Swid', ['FALCO']],
  ['Janke', ['SAMUS']],
  ['fidibidi', ['PEACH']],
  ['zapwad', ['FOX']],
  ['Critius', ['DR_MARIO']],
  ['JJFF', ['NESS']],
  ['Fallen', ['FALCO']],
  ['Hada', ['PEACH']],
  ['shwang', ['MARTH']],
  ['Ace?', ['LUIGI']],
  ['Neptune', ['ICE_CLIMBERS']],
  ['DayNeptune930', ['ICE_CLIMBERS']],
  ['AceBox', ['JIGGLYPUFF']],
  ['Kasumi', ['DR_MARIO']],
  ['MP3', ['NESS']],
  ['Ultra', ['FOX']],
  ['Russell', ['FOX']],
  ['Shleeum', ['FOX', 'FALCO', 'MARTH']],
  ['Phazon', ['SAMUS']],
  ['SpecialK', ['FALCO']],
  ['OC Zack', ['MARTH']],
  ['Noah', ['FOX']],
  ['Foxtrot', ['SHEIK']],
  ['Jasper', ['LUIGI']],
  ['honey!', ['FOX']],
])

const SEASONS = {
  "H1 2024": H1_2024_players,
  "H2 2023": H2_2023_players
}

export default function HomePage() {
  const [season, setSeason] = useState(Object.keys(SEASONS)[0])
  console.log(season)
  const players = SEASONS[season]
  const nameToPlayer = new Map(players.map((p) => [p.name, p]))
  players.forEach((p) => {
    p.characters = PLAYER_TO_CHARACTERS.get(p.name) ?? []
    p.player_records = p.records.map((r) => {
      return {
        wins: r.wins,
        losses: r.losses,
        opponent: nameToPlayer.get(r.opponent)
      }
    })
  })
  const sortedPlayersByStrength = [...players].sort((a, b) => b.colley_strength_of_schedule - a.colley_strength_of_schedule) as Player[]
  sortedPlayersByStrength.forEach((p, i) => {
    p.colley_strength_of_schedule_rank = i + 1
  })


  const seasonSelect = () => {
    return <div className="flex flex-row items-center justify-center">
      <h2 className="text-xl my-4 text-center text-white"> Season </h2>
      <select className="m-2 block py-3 px-4 text-base text-white bg-gray-900 rounded-lg border border-gray-500 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={(event) => {setSeason(event.target.value)}}
        value={season}>
      {Object.keys(SEASONS).map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  </div>
  }

  const coffee = () => {
    return <div className="p-2 text-gray-300 flex flex-col">
        <div>
          <a href="https://www.buymeacoffee.com/blorppppp" target="_blank" rel="noreferrer"
             className="text-gray-400 hover:text-indigo-300 mr-2 hover:underline">
            Buy me a coffee ☕
          </a>
        </div>
      </div>
  }
  return (
    <div className="flex flex-col items-center h-screen p-8">
      <h1 className="text-3xl m-4 text-center text-white">
        {settings.title}
      </h1>
      {seasonSelect()}
      <a href="https://www.colleyrankings.com/matrate.pdf" target="_blank" rel="noreferrer"
         className="text-gray-400 hover:text-indigo-300 mr-2 hover:underline">
        Ranking Methodology       
      </a>
      
      {coffee()}
      <Table players={players} />
      {coffee()}
    </div>
  );
}
