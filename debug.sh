#!/bin/sh

if [ $1 = "no-debug" ]; then
	echo "Not using debugger!"
	COMMAND="node"
	OPTION=""
else
	echo "Debugging app."
	COMMAND="node-debug"
	OPTION="--debug-brk=0 -p 7000"
fi

CMD="NODE_ENV=development $COMMAND $OPTION app.js"
echo $CMD
eval $CMD
