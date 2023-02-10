const randomDiv = document.getElementById("randomDiv")
const searchResultDiv = document.getElementById("searchResultDiv")
const searchButton = document.getElementById("searchButton")
const searchBox = document.getElementById("searchBox")
const ingredientDiv = document.getElementById("ingredientBox")
const ingredientUpdateDiv = document.getElementById("ingredients")
var searchUpdate = ""
var ingredientUpdate = ""

window.addEventListener("load",generateRandomMeal)
searchButton.addEventListener("click",checkSearchBox)
window.addEventListener("click", displayNone)
document.addEventListener('keypress', (event) => {
    if (event.key == "Enter") {
      checkSearchBox()
    }
  });


function displayNone() {
    ingredientDiv.style.display = "none"
}

function generateRandomMeal() {                                                  //fetching random meal data
    fetch ("https://www.themealdb.com/api/json/v1/1/random.php").then((response) => 
    response.json()).then((data) => {
        getNameAndLink(data)
    })
}

function getNameAndLink(details) {                                               //extracting only the name and img link from the data
    const mealId = details.meals[0].idMeal
    const mealName = details.meals[0].strMeal
    const imgLink = details.meals[0].strMealThumb
    updateRandomMeal(mealName,imgLink,mealId)
}

function updateRandomMeal(mealName,imgLink,mealId) {                                    //updating the image and meal name into the document
    let randomUpdate = `<div class="dataDiv" id=${mealId}><img src=${imgLink} alt="" srcset="" class="mealImg">
    <h2 class="mealName">${mealName}</h2></div>`
    randomDiv.innerHTML = randomUpdate;
    setOnclick("random")
}

function checkSearchBox() {                                                     //getting data from searchBox
    let searchedKeyword = searchBox.value
    if (searchedKeyword == "") {                                                //alerting when it's empty
        prepareToUpdateSearchedMeals()
        window.alert("Enter something to search!")
    } else {
        prepareToUpdateSearchedMeals()
        generateSearchedMeals(searchedKeyword)
    }
}

function prepareToUpdateSearchedMeals() {                                    //prerequisite for updating meal
    searchResultDiv.innerHTML= ""                                            //removing all the previously searched results
    searchUpdate = ""                                                        //resetting the searchUpdate codes if a new search is triggered
    document.getElementById("searchTitle").innerText = ""                    //clearing the previous title if exists
    document.getElementById("searchSubTitle").innerText = ""                 //clearing the previuos subTitle if exists

}

function generateSearchedMeals(searchedKeyword) {                                           //fetching the data of all meals for searched keyword
    fetch (`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchedKeyword}`).then((response) =>
    response.json()).then((data) => {
        if(data.meals==null) {                                                              //alerting if the data doesn't exist for the search
            window.alert("Sorry no results for your search :(")
        } else {
            document.getElementById("searchTitle").innerText = `Results for "${searchedKeyword}"`      //updating title
            document.getElementById("searchSubTitle").innerText = `(${data.meals.length} meals matched your search)`       //updating subTitle
            data.meals.forEach((details)=> {                                    //using forEach to pick every meal from the fetched data
                getNameAndLinkForSearch(details)
            })
            setOnclick("searched")
        }
    })
}

function getNameAndLinkForSearch(details) {                                 //extracting name and img link for every meal that is passed
    let mealId = details.idMeal
    let mealName = details.strMeal
    let imgLink = details.strMealThumb
    updateSearchedMeals(mealName,imgLink,mealId)
}

function updateSearchedMeals(mealName, imgLink,mealId) {                               //updating every meal and its image into the document
    searchUpdate+= `<div class="dataDiv" id=${mealId}><img src=${imgLink} alt="" srcset="" class="mealImg">
    <h2 class="mealName">${mealName}</h2></div>`
    searchResultDiv.innerHTML = searchUpdate;
}

function setOnclick(client) {
    let meals = document.getElementsByClassName("dataDiv")
    if(client=="searched") {                                                       //to ensure that onclick is not set twice for random meal
        for(let i=1; i<meals.length; i++) {
            meals[i].addEventListener("click", (e) => {
                getMealId(e)
            }, {capture : true})
          };
    } else {
        Array.from(meals, child => {
            child.addEventListener("click", (e) => {
                getMealId(e)
            }, {capture : true})
        });
    }
} 
    

function getMealId(event) {
    var clickedMealId = event.target.parentNode.id
    if(clickedMealId=="randomDiv" || clickedMealId=="searchResultDiv") {
        clickedMealId = event.target.id 
    }
    fetchIngredientsData(clickedMealId)
}

function fetchIngredientsData(mealId) {
    fetch (`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`).then((response) =>
    response.json()).then((data) => {
        let mealData = data.meals[0]
        let allKeys = Object.keys(mealData)
        filterIngredients(allKeys,mealData)
    })
}

function filterIngredients(allKeys,mealData) {
    ingredientDiv.style.display = "flex"
    ingredientUpdate = ""
    Array.from(allKeys, keyStr => {
        if (keyStr.match("Ingredient")) {
            let search = "mealData." + keyStr
            if(eval(search)!=""  && eval(search)!=null ) {
               updateIngredients(eval(search))
            }
        }
    });
}

function updateIngredients(ingredient) {
    ingredientUpdate += `<li class="list">${ingredient}</li>`
    ingredientUpdateDiv.innerHTML = ingredientUpdate
}







