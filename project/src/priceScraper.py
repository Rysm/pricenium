import unittest
import sys
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


#bool to toggle process
start = False

#Ask the user for which browser to launch in
while True:
    try:
        browseChoice = int(raw_input("Choose your browser (1-3). 1 = Firefox, 2 = Chrome \n"))
    except ValueError:
        print( "Please enter a number as your selection." )
    else:
        #if within range we're done here
        if 1 <= browseChoice <= 2:
            break
        else:
            print("Number must be 1 or 3.")

#Ask the user for which domain to go to
while True:
    try:
        urlChoice = int(raw_input("Where do you want to scrape? (1-3). 1 = Amazon, 2 = Ebay, 3 = Craigslist (plsno) \n"))
    except ValueError:
        print( "Please enter a number as your selection." )
    else:
        #if within range we're done here
        if 1 <= browseChoice < 3:
            break
        else:
            print("Number must be 1, 2, or 3.")

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
    browser = browserDict[browseChoice]();

    #Set the url
    url = urlDict[urlChoice]

    #Navigate to the initial URL
    browser.get(url)

    #Find the search bar
    searchBar = browser.find_element_by_name("field-keywords")

    #Call the search bar to search it
    searchBar.send_keys( productName, Keys.RETURN )

    browser.implicitly_wait(5) # seconds

    #Returns a list of all DOM items with their elements
#    WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.ID, "s-results-list-atf")) )

#    results = browser.find_elements_by_css_selector(".s-result-item")
    results = browser.find_elements_by_xpath("//*[contains(@id,'result_')]")

    final = []

#    print("results length " + str(len(results)))

    for i in results:

        #print(i.text)
        name = i.find_element_by_xpath('/h2[@class="a-size-medium s-inline  s-access-title  a-text-normal"]')

        #price = i.find_element_by_css_selector(".sx-price")
        #price = i.find_element_by_xpath(".//SPAN[@class='sx-price-whole']")

        #Append a mini dic
        final.append( {'product' : name.text})
        #final.append( {'price' : price.text} )
        #final.append( {'product' : name.text,'price' : price.text})

    print(final)

    browser.quit()

def ebaySearch():

    #Set browser var to selected choice
    browser = browserDict[browseChoice]();

    #Set the url
    url = urlDict[urlChoice]

    #Navigate to the initial URL
    browser.get(url)

    searchBar = browser.find_element_by_name("_nkw")

    searchBar.send_keys( productName, Keys.RETURN)

    browser.implicitly_wait(15) # seconds

    #Returns a list of all DOM items with their elements
    results = browser.find_elements_by_css_selector(".lvresult")

    final = []

#    print("results length " + str(len(results)))

    for i in results:

        #print(i.text)

        name = i.find_element_by_css_selector("h3.lvtitle")
        #name = i.find_element_by_xpath(".//*[@class='sresult lvresult clearfix li shic']/h3")

        price = i.find_element_by_css_selector(".lvprice")
        #price = i.find_element_by_xpath(".//*[@class='sresult lvresult clearfix li shic']/ul[1]/li[1]")

        #Append a mini dic
        final.append( {'product' : name.text,'price' : price.text})

        print(final)


    browser.quit()

def craigSearch():

    #Set browser var to selected choice
    browser = browserDict[browseChoice]();

    #Set the url
    url = urlDict[urlChoice]

    #Navigate to the initial URL
    browser.get(url)

    searchBar = browser.find_element_by_name("query")

    searchBar.send_keys( productName, Keys.RETURN )

    browser.implicitly_wait(10) # seconds

    #Returns a list of all DOM items with their elements
    #results = browser.find_elements_by_css_selector(".result-info")
    results = browser.find_elements_by_css_selector(".result-row")

    final = []

    #print("results length " + str(len(results)))

    for i in results:
        name = i.find_element_by_xpath(".//*[@class='result-title hdrlnk']")

        #price = i.find_element_by_tag_name(('a'))
        price = i.find_element_by_xpath(".//*[@class='result-meta']/span[1]")

        #Append a mini dic
        final.append( {'product' : name.text,'price' : price.text})

    print(final)

    browser.quit()

#A dictionary for avaialble browsers
browserDict = {
    1:webdriver.Firefox,
    2:webdriver.Chrome, #Make sure you have Chromedriver installed in your PATH
    #3:webdriver.Ie
}

#Dictionary for inital destinations
urlDict= {
    1: "https://www.amazon.com",
    2: "https://www.ebay.com",
    3: "https://www.craigslist.org"
}

#Dictionary of the functions based on domain
funcDict = {
    1: amazonSearch,
    2: ebaySearch,
    3: craigSearch
}

def main():

    if start:

        #Search up the item
        funcDict[urlChoice]()

        #start = False

if __name__ == "__main__":

    main()
