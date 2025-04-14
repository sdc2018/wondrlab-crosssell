#!/bin/bash

# Script to count lines of code in a Git project
# Usage: ./count_loc.sh

# Check if we're in a Git repository
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Error: This directory is not a Git repository."
    exit 1
fi

# Count lines in all tracked files, excluding common non-code extensions
echo "Counting lines of code in tracked files..."
git ls-files | grep -E -v '\.(png|jpg|jpeg|gif|pdf|zip|tar|gz|bin|exe|o|obj|md|log)$' | xargs cat | grep -v '^$' | wc -l | awk '{print "Total lines of code: " $1}'

# Optional: List files included in the count
echo "Files included in the count:"
git ls-files | grep -E -v '\.(png|jpg|jpeg|gif|pdf|zip|tar|gz|bin|exe|o|obj|md|log)$'


