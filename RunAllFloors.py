import webbrowser
import time

# path to firefox executable
PATH_FIREFOX = "C://Program Files (x86)/Mozilla Firefox/firefox.exe"

# path to Stuff.html
PATH_MAZEMAP = "C://Users/Butikk/Documents/Mazemap/Stuff.html"

NUM_FLOORS = 50

START_FLOOR = 1

# delay in seconds
DELAY = 5

def updateID(ID):

	#clear file of content
	#file = open("floorID.js", "w").close()

	file = open("floorID.js", "w")

	file.write("var FLOOR_ID = " + str(ID) + ";")

	file.close()

	return ID + 1

def setBrowser(browserName, path):
	webbrowser.register(browserName, None, webbrowser.BackgroundBrowser(path))

def runAllFloors():
	ID = START_FLOOR

	setBrowser('firefox', PATH_FIREFOX)

	for i in range(NUM_FLOORS):

		ID = updateID(ID)

		openInNewTab = 2

		webbrowser.open(PATH_MAZEMAP, openInNewTab)

		time.sleep(DELAY)

runAllFloors()




