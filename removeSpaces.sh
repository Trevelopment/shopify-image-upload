#!/bin/bash

for f in ./photos/**/*\ * 
do 
  mv -v "$f" "${f// /}"; 
done

for f in ./photos/**/*__* 
do 
  mv -v "$f" "${f/__/_}"; 
done

#one liner
#for f in ./**/*__*; do mv -v "$f" "${f// /}"; done

exit 0