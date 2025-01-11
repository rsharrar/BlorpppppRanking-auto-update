from scipy.linalg import solve
from braacket import load_players, Player
import json
import numpy as np
from datetime import datetime
from pathlib import Path

def colley(players, i,j):
  player = players[i]
  if i == j:
    total_sets = sum(r.wins + r.losses for r in player.records)
    return total_sets + 2
  return -sum(r.wins + r.losses for r in player.records if r.opponent.braacket_rank == j + 1)

def colley_b(players, i):
  n_wins = sum([r.wins for r in players[i].records])
  n_losses = sum([r.losses for r in players[i].records])
  return 1 + 0.5*(n_wins-n_losses)

def strength_of_schedule(player_to_rank, player):
  total_games=sum(r.losses+r.wins for r in player.records)
  return sum(player_to_rank[r.opponent.name]*(r.losses+r.wins) for r in player.records)/total_games

def solve_colley(players, name_to_player):
  n = len(players)
  M2 = np.zeros((n,n))
  for i in range(n):
    for j in range(n):
      M2[i,j] = colley(players, i,j)
  b = np.array([colley_b(players, i) for i in range(len(players))])
  vec = np.ndarray.flatten(abs(solve(M2,b)))
  sorted_indices = vec.argsort()
  ranked = [(players[i].name, vec[i]) for i in sorted_indices]
  ranked.reverse()

  player_to_rank = {p[0]:p[1] for p in ranked}
  for i, (player, score) in enumerate(ranked):
    p = name_to_player[player]
    p.colley_rank = i + 1
    p.colley_score = score
    p.colley_strength_of_schedule = strength_of_schedule(player_to_rank, p)

def record_to_dict(r):
  return {
    'wins': r.wins,
    'losses': r.losses,
    'opponent': r.opponent.name
  }

def player_to_dict(p):
  return {
    'name': p.name,
    'braacket_rank': p.braacket_rank,
    'colley_rank': p.colley_rank,
    'colley_score': p.colley_score,
    'colley_strength_of_schedule': p.colley_strength_of_schedule,
    'records': [record_to_dict(r) for r in p.records]
  }

class EnhancedJSONEncoder(json.JSONEncoder):
  def default(self, o):
    if isinstance(o, Player):
      return player_to_dict(o)
    return super().default(o)

def load_season(ranking_id: str, out_dir: Path):
  players, name_to_player = load_players("comelee", ranking_id)
  solve_colley(players, name_to_player)
  
  dirpath = out_dir / ranking_id
  dirpath.mkdir(exist_ok=True, parents=True)
  print(f"Made path {dirpath}")
  out_file = dirpath / "players.json"
  
  print(f"Writing data to {out_file}")
  with out_file.open(mode='w', encoding='utf-8') as f:
    json.dump(players, f, ensure_ascii=False, indent=4, cls=EnhancedJSONEncoder)

def main():
  # latest season is first
  CUR_SEASON = "8982631B-07FF-4955-915C-CF8EC7AAAB72"
  PAST_SEASONS = [
          "3A6E2789-CD62-4462-9F28-196FC8B05EA2",
          "B3B6A4C9-4C45-49B5-BC3E-97BFC07566E4",
          "1B2D2093-284F-4B5F-A1A7-F33814FCCBDE",
  ]
  ALL= [CUR_SEASON] + PAST_SEASONS

  file_dir = Path(__file__).parent
  out_dir = file_dir / "data"
  for season in ALL:
      load_season(season, out_dir)

  # Save a timestamp in unix time for front end to read
  ts = {"timestamp": datetime.now().timestamp()}
  timestamp_file = out_dir / "timestamp.json"
  with timestamp_file.open(mode="w", encoding="utf-8") as ts_f:
    json.dump(ts, ts_f, ensure_ascii=False, indent=4, cls=EnhancedJSONEncoder)

if __name__ == "__main__":
  main()
