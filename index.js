const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-length]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copybtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#UpperCase");
const lowercaseCheck=document.querySelector("#LowerCase");
const numbersCheck=document.querySelector("#Numbers");
const symbolsCheck=document.querySelector("#Symbols");
const indicater=document.querySelector("[data-indicator]");
const genraterbutton=document.querySelector(".GenerateButton");
const allCheckbox=document.querySelectorAll("input[type=Checkbox]");
const symbols= '~!@#$%^&*()-_=+[{]}|;":,<.>/?';

let password="";
let passwordLength=10;
let checkcount=0;
handlerSlider();

setIndicater("#ccc");

//set password length
// yeh bass ui per reflact karta ha
function handlerSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"

}
// yeh indicater ka color ko change karta ha
function setIndicater(color){
    indicater.style.backgroundColor = color;
    // shadow
    indicater.style.boxShadow=`0px 0px 12px 1px ${color}`;
}
// min max ki range ma randam integer
function getInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function getRandomNumber(){
    return getInteger(0,9);
}

function generateLowerCase(){
     return String.fromCharCode(getInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getInteger(65,91));
}
function generateSymbols(){
    const randomNUm=getInteger(0,symbols.length);
    return symbols.charAt(randomNUm);
}
// kon kon sa check or unhecked
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked)hasUpper=true;
    if(lowercaseCheck.checked)hasLower=true;
    if(numbersCheck.checked)hasNum=true;
    if(symbolsCheck.checked)hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) >= passwordLength >=8)
        setIndicater("0f0");
    else if(
        (hasLower|| hasUpper)&&(hasNum||hasSym)&&passwordLength>=6
    ){
        setIndicater("#ff0");
    }
    else{
        setIndicater("#f00");
    }

}
// password display vala input ma copy hoga ya na 
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerHTML="failed";
    }
    copyMsg.classList.add("active");
    setTimeout(( )=>{
        copyMsg.classList.remove("active");
    },2000);

}
function shufflePassword(passwordArray){
    // fisher yates method
    for(let i = passwordArray.length - 1 ; i > 0 ; i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=passwordArray[i];
        passwordArray[i]=passwordArray[j];
        passwordArray[j]=temp;
    }
    let str="";
    passwordArray.forEach((el)=>(str+=el));
    return str;
}

function handlerSliderfunction(){
    checkcount=0;
    allCheckbox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkcount++;
    });

    if(passwordLength<checkcount){
        passwordLength=checkcount;
        handlerSlider();
    }

}

allCheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handlerSliderfunction);
}) 
// yeh value change ker rha ha slider
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handlerSlider();

})
// if password are visible then copy
copybtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

genraterbutton.addEventListener('click',()=>{
    // kio checkbox nhi ha 
    if(checkcount==0)return;

    if(passwordLength<checkcount){
        passwordLength=checkcount;
        handlerSlider();
    }
console.log("runnnnnnnnnnnnnnnnnnnnnnnnn");
    // find new password
    password="";

    // only put mentioned by checkboxes
    // if(uppercase.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercase.checked){
    //     password+=generateLowerCase();
    // }
    // if(num.checked){
    //     password+=getRandomNumber();
    // }
    // if(symbols.checked){
    //     password+=generateSymbols();
    // }

    let funArr=[];

    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funArr.push(getRandomNumber);
    }
    if(symbolsCheck.checked){
        funArr.push(generateSymbols);
    }
    // compalsory addition
    for (let i = 0; i <funArr.length; i++) {
        password+=funArr[i]();
    }
    console.log("compulsory done");
    // remaining addition
    for (let i = 0; i < passwordLength-funArr.length; i++) {
        let randamIndex=getInteger(0,funArr.length);
        password+=funArr[randamIndex](); 
    }
    console.log("remaninng done");

    // shuffle the password
    password=shufflePassword(Array.from(password));
    console.log("Shuffling password done");

    // show password in text area
    passwordDisplay.value=password;
    console.log("UI done");

    // calculate strength
    calcStrength();


});
