import unittest
import sys
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import os

#bool to toggle process
start = False

#Ask the user for which browser to launch in
while True:
    try:
        browseChoice = int(raw_input("Choose your browser (1-3). 1 = Firefox, 2 = Chrome, 3 = Internet Explorer \n"))
    except ValueError:
        print( "Please enter a number as your selection. \n" )
    else:
        #if within range we're done here
        if 1 <= browseChoice =< 3:
            break
        else:
            print("Number must be 1, 2, or 3. \n")

#Ask the user for which domain to go to
while True:
    try:
        urlChoice = int(raw_input("Where do you want to scrape? (1-3). 1 = Amazon, 2 = Ebay, 3 = Craigslist (plsno) \n"))
    except ValueError:
        print( "Please enter a number as your selection. \n" )
    else:
        #if within range we're done here
        if 1 <= browseChoice =< 3:
            break
        else:
            print("Number must be 1, 2, or 3. \n")

#Ask the user for which product to search
while True:
    try:
        productName = str(raw_input("Enter the name of the product you want to search up \n"))
    except ValueError:
        print("Please enter a string as the input.")
    else:
        if len(productName)>0:
            start = True #we can begin the processes
            break
        else:
            print("Please enter the name of the product you want to search up")

def amazonSearch():

    #Set browser var to selected choice
    browser = browserDict[browseChoice];

    #Set the url
    url = urlDict[urlChoice]

    #Navigate to the initial URL
    browser.get(url)

    #Find the search bar
    searchBar = browser.find_element_by_name("field-keywords")

    #Call the search bar to search it
    searchBar.send_keys( productName, Keys.RETURN )

def ebaySearch():

    #Set browser var to selected choice
    browser = browserDict[browseChoice];

    #Set the url
    url = urlDict[urlChoice]

    #Navigate to the initial URL
    browser.get(url)

    searchBar = browser.find_element_by_name("_nkw")

    searchBar.send_keys( productName, Keys.RETURN)

def craigSearch():

    #Set browser var to selected choice
    browser = browserDict[browseChoice];

    #Set the url
    url = urlDict[urlChoice]

    #Navigate to the initial URL
    browser.get(url)

    searchBar = browser.find_element_by_name("query")

    searchBar.send_keys( productName, Keys.RETURN )

def main():

    #A dictionary for avaialble browsers
    browserDict = dict(
        1:webdriver.Firefox(),
        2:webdriver.Chrome(), #If you're on Mac OSX brew install works
        3:webdriver.Ie()
    )

    #Dictionary for inital destinations
    urlDict = dict(
        1: "https://www.amazon.com",
        2: "https://www.ebay.com",
        3: "https://www.craigslist.org"
    )

    #Dictionary of the functions based on domain
    funcDict = dict(
        1: amazonSearch,
        2: ebaySearch,
        3: craigSearch
    )

    if start:

        #Search up the item
        funcDict[urlChoice]()

        #start = False

if __name__ == "__main__":

    main()
