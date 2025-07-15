#!/bin/bash
cd /home/kavia/workspace/code-generation/interactive-tic-tac-toe-22095b24/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

