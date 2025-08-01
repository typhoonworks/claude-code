---
description: "Normalize a Linear issue ID and fix it according to our coding standards"
argument-hint: "[issueId]"
---

Fix Linear issue #!bash -lc '
  # grab the first positional argument
  raw="$1"
  # if it doesn’t already start with ACC-, prepend it
  if [[ $raw != ACC-* ]]; then
    raw="ACC-$raw"
  fi
  # emit the normalized ID
  printf "%s" "$raw"
' "{{args.issueId}}" following our coding standards
