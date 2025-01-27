## Erzeugen eines Docker Image
## Image erhält den Namen mysql_image
## Muss nur einmal ausgeführt werden

docker build -f Dockerfile -t swtp_db .


## Erzeugen eines Docker Container
## - Im Container werden automatisch SQL-Scripte ausgeführt
## - Es erfolgt ein Netzwerk- und Datei-Mapping
## Ausführen im Projektverzeichnis
## Muss nur einmal ausgeführt werden

== MacOS oder Linux  ==

docker run --name swtpDbContainer -d -p3306:3306 swtp_db



## Nachdem der Container erzeugt wurde
## kann er immer wieder gestartet oder beendet werden

docker start swtpDbContainer
docker stop swtpDbContainer



mysql -u root -p

USE swtp;

Show tables;

exit;