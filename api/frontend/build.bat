@echo off
start "" "C:\Program Files\Git\git-bash.exe" -i -c "npm install && npm run build && cd dist && jar cvf banking.war ."
