
## Erzeugen eines Docker Image
## Image erhält den Namen notiz_db_image 
## Muss nur einmal ausgeführt werden

docker build -f Dockerfile -t loan_app_image .


## Erzeugen eines Docker Container
## - Im Container werden automatisch SQL-Scripte ausgeführt
## - Es erfolgt ein Netzwerk-Mapping
## - Auf ein Volume-Mapping wird hier verzichtet
## Ausführen im Projektverzeichnis
## Muss nur einmal ausgeführt werden


docker run --name swtpAppContainer -d -p8080:8080 -e  loan_app_image


## Nachdem der Container erzeugt wurde
## kann er immer wieder gestartet oder beendet werden
## Die Konsolenbefehle hierzu lauten

docker start swtpAppContainer
docker stop swtpAppContainer




