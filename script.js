//line 29 slider ka bgc and moz wala bus dekhlena
const inputSlider=document.querySelector("[data-lengthSlider]")
const lengthDisplay=document.querySelector("[data-lengthNumber]")
const passwordDisplay=document.querySelector("[data-passwordDisplay]")
const copyBtn=document.querySelector("[data-copy]")
const copyMsg=document.querySelector("[data-copyMsg]")
const uppercaseCheck=document.querySelector("#uppercase")
const lowercaseCheck=document.querySelector("#lowercase")
const numbersCheck=document.querySelector("#numbers")
const symbolsCheck=document.querySelector("#symbols")
const indicator=document.querySelector("[data-indicator]")
const generateBtn=document.querySelector(".generateBtn")
const allCheckBox=document.querySelectorAll("input[type=checkbox]")
const symbol='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//Initial Configuration
let password="";
let passwordLength=10;
let checkCount=0 ;
//set indicator to grey
setIndicator('#ccc')
handleSlider();

//set passwordLength
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    // Nahi chala 
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundsize=(((passwordLength-min)*100)/(max-min))+ "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`
    //shadow
   
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbol.length);
    return symbol.charAt(randNum);
}

function calcStrength(){
     let hasUpper=false;
     let hasLower=false;
     let hasNum=false;
     let hasSym=false;

     if(uppercaseCheck.checked) hasUpper=true;
     if(lowercaseCheck.checked) hasLower=true;
     if(numbersCheck.checked) hasNum=true;
     if(symbolsCheck.checked) hasSym=true;

     if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator('#0f0');
     }
     else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator('#ff0');
     }
     else{
        setIndicator('#f00');
     }
}

async function  copyContent(){
    try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }

    //to make copy text visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

//****Event Listners
//Input EventSlider changes -> UI pe changes 
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

//copy Button 
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
      copyContent();
    //or password.length()>0 then copyContent();
})

function handleCheckBoxChange(){
    //starting se count
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    })

    //if length of the password is less than the number of checkboxes ticked so change to 4  -> special case
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

//Checkboxes 
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

//shuffle array function
function shufflePassword(array){
    //fisher yates methods
    for(let i=array.length-1;i>=0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>{str+=el});
    return str;
}
//Generate Password
generateBtn.addEventListener('click',()=>{
    //none of the checkbox are selected
    if(checkCount==0) 
    return;
    //special case
    if(passwordLength<checkCount){
      passwordLength=checkCount;
      handleSlider();
    }

    //let start the journey to find new password

    //remove old password
    password="";

    //lets put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheckcaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

    let funcArr=[];
    if(uppercaseCheck.checked)
      funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
      funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
      funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
      funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex= getRndInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }

    //shuffle array
    password=shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value=password;

    //calculate the strength
    calcStrength();
})