#!/bin/bash

sudo systemctl stop supervisor

sleep 5

# XXX: workaround because supervisor does not stop "npm run serve"
# refactor to use PM2 for decent fix
for pid in `ps aux | grep [n]ode | awk '{ print $2 }'`; do
	kill -9 $pid || true
done

sudo systemctl start supervisor

