window.addEventListener("load",function(){
    $(".loading").fadeIn(800,function(){
        getMealName("").then(() => {
            $(".loading").fadeOut(800,function(){
                $("body").css("overflow","auto");
                $(".meals").removeClass("d-none");
            });
        })
    })
});
let sidebarInnerWidth= $(".sidebar-inner").innerWidth();
$("#sidebar").css("left", -sidebarInnerWidth);
$(document).ready(function(){
    $("#sidebar .sidebar-icon .icon i").click(function(){
        if($("#sidebar").css("left")=="0px"){
            $("#sidebar").animate({"left": -sidebarInnerWidth},600);
            $(".fa-xmark").addClass("d-none");
            document.querySelector(".fa-bars").classList.replace("d-none","d-block");
        }else{
            $("#sidebar").animate({"left": "0px"},600);
            $(".fa-xmark").removeClass("d-none");
            document.querySelector(".fa-bars").classList.add("d-none");
        }
    })
    $(".fa-bars").click(function(){
        $("#sidebar li").eq(0).animate({"top": "0px"},1000)
        $("#sidebar li").eq(1).animate({"top": "0px"},1200)
        $("#sidebar li").eq(2).animate({"top": "0px"},1400)
        $("#sidebar li").eq(3).animate({"top": "0px"},1600)
        $("#sidebar li").eq(4).animate({"top": "0px"},1800)
    })
    $(".fa-xmark").click(function(){
        $("#sidebar li").hide(1000);
        $("#sidebar li").show(500);
        $("#sidebar li").animate({"top": "150px"})
    })
});
$(function(){
    $("a[href='#']").click(function(){
        $("#sidebar").animate({"left": -sidebarInnerWidth},600);
        $(".fa-xmark").addClass("d-none");
        document.querySelector(".fa-bars").classList.replace("d-none","d-block");
    })
    $(".link-search ").click(function(){
        $(".search").removeClass("d-none");
        $(".meals").addClass("d-none");
    });
    $(".link-cat").click(function(){
        $(".search").addClass("d-none");
        $(".meals").removeClass("d-none");
        getAllCategories();
    });
    $(".link-area").click(function(){
        $(".search").addClass("d-none");
        $(".meals").removeClass("d-none");
        getAreas();
    })
    $(".link-ingredient").click(function(){
        $(".search").addClass("d-none");
        $(".meals").removeClass("d-none");
        getingredients();
    })
    $(".link-contact").click(function(){
        $(".search").addClass("d-none");
        $(".meals").addClass("d-none");
        $(".contact").removeClass("d-none");
    })
})

document.querySelector(".input-name").addEventListener("keyup",function(){
    $(".meals").removeClass("d-none");
    getMealName(this.value);
});

let rowData=document.querySelector("#rowData");
let response=[];

// search 
// search by name
async function getMealName(term){
    rowData.innerHTML=""
    $(".loading2").fadeIn(500);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json()
    response.meals ? displayMeals(response.meals) : displayMeals([])
    showDetails();
    $(".loading2").fadeOut(500);
}

function displayMeals(arr){
    let cartoona = "";
    for(let i=0 ; i < arr.length ;i++){
        cartoona += `
        <div class="col-sm-6 col-md-3 d-flex justify-content-center">
            <div class="content position-relative overflow-hidden rounded-3" onclick="getMealDetails(${arr[i].idMeal})">
                <img src="${arr[i].strMealThumb}" class="w-100" alt="">
                <div class="layout position-absolute d-flex justify-content-center align-items-center text-black p-2">
                    <h3 class="h5">${arr[i].strMeal.split(" ").slice(0,10).join(" ")}</h3>
                </div>
            </div>
        </div>
        `
    }
    rowData.innerHTML = cartoona;
}

document.querySelector(".input-letter").addEventListener("keyup",function(){
    getMealByLetter(this.value);
});

// search by letter
let data=[];
async function getMealByLetter(letter){
    $(".loading2").fadeIn(600);
    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    data = await api.json();

    data.meals ? displayMeals(data.meals) : displayMeals([]);
    showDetails();
    $(".loading2").fadeOut(600);
}

function showDetails(){
    $(".content").click(function(){
        $(".search").addClass("d-none");
        $(".meals").removeClass("d-none");
    })
}

// details of meal
let res=[];
async function getMealDetails(id){
    $(".loading").fadeIn(500);
    let api= await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    res= await api.json();
    console.log(res);
    displayMealDetails(res.meals[0]);
    $(".loading").fadeOut(500);
}

function displayMealDetails(arr){
    let ingredients = ``;
    for (let i = 1; i <= 20; i++) {
        if (arr[`strIngredient${i}`]) {
            ingredients += `<li class="rounded-2 m-2 p-1">${arr[`strMeasure${i}`]} ${arr[`strIngredient${i}`]}</li>`
        }
    }
    let box="";
        box =`
        <div class="col-md-4">
        <img src="${arr.strMealThumb}" class="w-100" alt="">
        <h2 class="px-md-4 px-5 ms-4 ms-sm-0">${arr.strMeal}</h2>
    </div>
    <div class="col-md-8 ps-5 ms-4 ms-sm-0 ps-md-0">
        <h2>Instructions</h2>
        <p>${arr.strInstructions}</p>
        <h3>Area: ${arr.strArea}</h3>
        <h3>Category : ${arr.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex flex-row flex-wrap">
            ${ingredients}
        </ul>
        <h3>${arr.strTags?"Tags :":""}</h3>
        <ul class="list-unstyled d-flex flex-wrap w-75">
            <li class="rounded-2 text m-2">${arr.srtTags?arr.strTags:""}</li>
        </ul>
        <a href="${arr.strSource}" class="btn btn-success">Source</a>
        <a href="${arr.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>
        `
    rowData.innerHTML=box;
}

// all categories
let catRes=[];
async function getAllCategories(){
    $(".loading").fadeIn(500);
    let api= await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    catRes= await api.json();
    displayAllCategories(catRes.categories);
    $(".loading").fadeOut(500);
}

function displayAllCategories(arr){
    let cartoona = "";
    for(let i=0 ; i<arr.length ;i++){
        cartoona += `
        <div class="col-sm-6 col-md-3">
        <div class="content position-relative overflow-hidden rounded-3" onclick="getCategory('${arr[i].strCategory}')">
            <img src="${arr[i].strCategoryThumb}" class="w-100" alt="">
            <div class="layout text-center position-absolute text-black p-2">
                <h2>${arr[i].strCategory}</h2>
                <p class="ps-5 ps-sm-0">${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
            </div>
        </div>
    </div>
        `
    }
    rowData.innerHTML=cartoona;
}

// category of meal
let responseCat=[];
async function getCategory(category){
    $(".loading").fadeIn(500);
    let api= await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    responseCat= await api.json();
    displayMeals(responseCat.meals.slice(0,20));
    getMealDetails(responseCat.meals.idMeal);
    showDetails();
    $(".loading").fadeOut(500);
}

    // meal area
let resArea=[];
async function getAreas(){
    $(".loading").fadeIn(500);
    let api= await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    resArea= await api.json();
    displayArea(resArea.meals);
    $(".loading").fadeOut(500);
}

function displayArea(arr){
    box="";
    for(let i=0 ;i<arr.length ;i++){
        box +=`
            <div class="col-sm-6 col-md-3 area text-center mx-auto" onclick="getMealsArea('${arr[i].strArea}')">
                <div class="icon">
                    <i class="fa-solid fa-house-laptop"></i>
                </div>
                <h2>${arr[i].strArea}</h2>
            </div>
        `
    }
    rowData.innerHTML=box;
}

let mealArea=[];
async function getMealsArea(area){
    $(".loading").fadeIn(500);
    let api= await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    mealArea= await api.json();
    displayMeals(mealArea.meals);
    $(".meals").removeClass("d-none");
    showDetails();
    $(".loading").fadeOut(500);
}

// ingredients
let responseIng=[];
async function getingredients(){
    $(".loading").fadeIn(500);
    let api= await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    responseIng= await api.json();
    displayIngredients(responseIng.meals.slice(0,20));
    $(".loading").fadeOut(500);
}

function displayIngredients(arr){
    let box= "";
    for(let i=0 ; i<arr.length ;i++){
        box +=`
        <div class="col-sm-6 col-md-3 area text-center mx-auto" onclick="getMealsIngredient('${arr[i].strIngredient}')">
            <div class="icon">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            </div>
            <h3>${arr[i].strIngredient}</h3>
            <p class="ps-5 ps-sm-3 ps-md-0">${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
        </div>
        `
    }
    rowData.innerHTML=box;
}

let mealIngredient=[];
async function getMealsIngredient(ingredient){
    $(".loading").fadeIn(500);
    let api= await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    mealIngredient= await api.json();
    displayMeals(mealIngredient.meals);
    $(".meals").removeClass("d-none");
    $(".areas").addClass("d-none");
    showDetails();
    $(".loading").fadeOut(500);
}

// regex
// regex name
function nameRegex(){
    let regex= /^[a-zA-z]+$/;
    document.querySelector(".userName").addEventListener("keyup",function(){
        if(regex.test(document.querySelector(".userName").value)==true){
            return document.querySelector("#alertName").classList.add("d-none");
        }
        else{
            document.querySelector("#alertName").classList.remove("d-none");
        }
    })
}

// email regex
function emailRegex(){
    let regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    document.querySelector(".userEmail").addEventListener("keyup",function(){
        if(regex.test(document.querySelector(".userEmail").value)==true){
            return document.querySelector("#alertEmail").classList.add("d-none");
        }else{
            document.querySelector("#alertEmail").classList.remove("d-none");
        }
    })
}

// regex phone
function phoneRegex(){
    let regex=/^(002)?(01)[0125][0-9]{8}$/
    document.querySelector(".userPhone").addEventListener("keyup",function(){
        if(regex.test(document.querySelector(".userPhone").value)==true){
            return document.querySelector("#alertPhone").classList.add("d-none");
        }else{
            document.querySelector("#alertPhone").classList.remove("d-none");
        }
    })
}

// regex age
function ageRegex(){
    let regex=/^[0-9]{1,2}$/
    document.querySelector(".userAge").addEventListener("keyup",function(){
        if(regex.test(document.querySelector(".userAge").value)==true){
            return document.querySelector("#alertAge").classList.add("d-none");
        }else{
            document.querySelector("#alertAge").classList.remove("d-none");
        }
    })
}

// password regex
function passwordRegex(){
    let regex=/^[0-9]{8,}[a-zA-Z]$/
    document.querySelector(".userPassword").addEventListener("keyup",function(){
        if(regex.test(document.querySelector(".userPassword").value)==true){
            return document.querySelector("#alertPassword").classList.add("d-none");
        }else{
            document.querySelector("#alertPassword").classList.remove("d-none");
        }
    })
}

// repassword
function repasswordRegex(){
    document.querySelector(".repassword").addEventListener("keyup",function(){
        if(document.querySelector(".repassword").value == document.querySelector(".userPassword").value){
            return document.querySelector("#alertRepassword").classList.add("d-none");
        }
        else{
            document.querySelector("#alertRepassword").classList.remove("d-none");
        }
    })
}
function validation(){
    nameRegex();
    emailRegex();
    phoneRegex();
    ageRegex();
    passwordRegex();
    repasswordRegex();
    if(nameRegex() == true && emailRegex() == true && phoneRegex() == true && ageRegex() == true && passwordRegex() == true && repasswordRegex() == true){
        document.querySelector(".submitBtn").removeAttribute("disabled");
    }
    else{
        document.querySelector(".submitBtn").setAttribute("disabled",true);
    }
}
validation();