import requests
from bs4 import BeautifulSoup
from dataclasses import dataclass
import re

SIZE = 50

@dataclass
class H2HSubset:
  col_names: list
  h2h_cells: list
  num_pages: int

@dataclass
class Player:
  name: str
  braacket_rank: int #braacket rank
  colley_rank: int
  colley_score: float
  colley_strength_of_schedule: float
  records: list

@dataclass
class Record:
  opponent: Player
  wins: int
  losses: int

def record_from_cell(cell, opponent):
  results = cell.split(" - ")
  return Record(opponent=opponent, wins=int(results[0]), losses=int(results[1]))

# https://braacket.com/league/:LEAGUE_ID/head2head/:RANKING_ID
def load_players(league_id, ranking_id):
  def get_h2h_subset(r, c):
    url = (f"https://braacket.com/league/{league_id}/head2head/{ranking_id}?rows={SIZE}&cols={SIZE}"
            + f"&page={r+1}&page_cols={c+1}&data=result&game_character=&country=&search=")
    page = requests.get(url)
    s = BeautifulSoup(page.text, "html.parser")
    col_names = [n.text.strip() for n in s.select("#league_stats_headtohead tbody th:nth-child(2)")]
    rows = s.select("#league_stats_headtohead tbody tr")
    h2h_cells = [[t.text.strip() for t in r.select("td")] for r in rows]
    num_pages = int(re.sub("[^0-9]", "", s.select(".search-pagination .input-group-addon")[-1].text))
    return H2HSubset(col_names=col_names, h2h_cells=h2h_cells, num_pages=num_pages)

  # load h2h matrix
  origin = get_h2h_subset(0, 0)
  h2h = origin.h2h_cells
  player_names = origin.col_names
  pages = origin.num_pages
  for r in range(0, pages):
    for c in range(0, pages):
      if r == 0 and c == 0:
        continue
      subset = get_h2h_subset(r, c)
      if c == 0:
        player_names.extend(subset.col_names)
        h2h.extend(subset.h2h_cells)
      else:
        for subset_row in range(0, len(subset.h2h_cells)):
          h2h[r*SIZE + subset_row].extend(subset.h2h_cells[subset_row])

  # populate players from h2h matrix
  name_to_player = {}
  players = []
  for i, p in enumerate(player_names):
    player = Player(name=p, braacket_rank=i+1, records=[], colley_rank=0, colley_score=0, colley_strength_of_schedule=0)
    name_to_player[p] = player
    players.append(player)
  for y in range(len(h2h)):
    records = []
    for x in range(len(h2h)):
      if y == x:
        continue
      record = record_from_cell(h2h[y][x], name_to_player[player_names[x]])
      if record.wins + record.losses > 0:
        records.append(record)
    name_to_player[player_names[y]].records = records
  return players, name_to_player
