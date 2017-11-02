#!/bin/bash
###
 # Created by sswensen on 4/24/17.
 # This tiny program runs two linux commands at the same time
 # Usage:
 	# $ ./ss "echo command1" "echo command2"
 	# Remember to `chmod +x ss` before running the file
###
for i in "$@"; do {
  $i&s=$!
  l+=" $s";
} done
trap "kill $l" SIGINT
wait $l
