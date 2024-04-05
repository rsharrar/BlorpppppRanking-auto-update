#!/bin/bash -l
DIR_PATH=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$DIR_PATH" 
python3 build_ranking.py
