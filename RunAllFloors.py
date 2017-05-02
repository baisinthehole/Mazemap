import webbrowser
import time

# path to firefox executable
PATH_FIREFOX = "C://Program Files (x86)/Mozilla Firefox/firefox.exe"

# path to Stuff.html
PATH_MAZEMAP = "C://Users/Butikk/Documents/Mazemap/Stuff.html"
# PATH_MAZEMAP = "C://Users/missi/OneDrive/Documents/JavaScriptWorkspace/MazemapFun/Stuff.html"

NUM_FLOORS = 20

START_FLOOR = 401

# FLOORS = [1672, 246, 351, 70, 349, 59, 168, 155, 197, 374, 326, 94, 241, 220, 81, 408, 380, 295, 352, 311, 148, 300, 343, 142, 247, 141, 354, 85, 378, 65, 96, 178, 160, 236, 358, 234, 260, 355, 98, 100, 254, 200, 9, 353, 62]
FLOORS = [96, 141, 148, 260, 300, 354, 358, 380]

# delay in seconds
DELAY = 60

def writeInfoToFile(ID):

	#clear file of content
	#file = open("floorID.js", "w").close()

	file = open("floorID.js", "w")

	line1 = "var FLOOR_ID = " + str(ID) + ";"

	line2 = "console.log(" + str(ID) + ");"

	file.writelines([line1, line2])

	file.close()

def setBrowser(browserName, path):
	webbrowser.register(browserName, None, webbrowser.BackgroundBrowser(path))

def runAllFloors():
	setBrowser('firefox', PATH_FIREFOX)

	for i in range(len(FLOORS)):

		writeInfoToFile(FLOORS[i])

		openInNewTab = 2

		webbrowser.open(PATH_MAZEMAP, openInNewTab)

		time.sleep(DELAY)

runAllFloors()




