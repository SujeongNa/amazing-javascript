var tetrisTable = document.querySelector('#tetris-table');
var blocks = {
    0:['white', false, []],
    1:['red', true, [
        [1,1], 
        [1,1]
    ]],
    2:['blue', true, [
        [2,0,0], 
        [2,2,2]
    ]],
    3:['green', true, [
        [0,3,0], 
        [3,3,3]
    ]],
    4:['yellow', true, [
        [0,0,4], 
        [4,4,4]
    ]],
    5:['navy', true, [
        [0,5,5], 
        [5,5,0]
    ]],
    6:['violet', true, [
        [6,6,0], 
        [0,6,6]
    ]],
    7:['pink', true, [
        [7,7,7,7]
    ]],
    10:['red', false, []],
    20:['blue', false, []],
    30:['green', false, []],
    40:['yellow', false, []],
    50:['navy', false, []],
    60:['violet', false, []],
    70:['pink', false, []],
}
var tetrisData = [];
var isGameOver=true;
var isPaused=false;

var isFloorReached=false;
var isLeftReached=false;
var isRightReached=false;
var stopDown=false;

var score=0;
var interval;

window.addEventListener('keyup',(e)=>{
    console.log(e);
        if(e.code==='Space'){ dropBlock();}
        if(e.code==='ArrowUp'){lotateBlock();}     
})
window.addEventListener('keydown',(e)=>{
        //console.log(e);
        switch(e.code){
            case 'ArrowRight':moveRight();
            break;
            case 'ArrowLeft':moveLeft();
            break;
            case 'ArrowDown':moveDown();
            break;
            case 'Escape': PauseResume();
            break;
            case'Enter': StartGame();
            break;
            default:
            break;
            }
});        
function createTetrisTable(){
    var fragment = document.createDocumentFragment();
            [...Array(20).keys()].map((el, i)=>{
                var tr = document.createElement('tr');
                fragment.appendChild(tr);
                var arr = [];
                tetrisData.push(arr);
    
                [...Array(10).keys()].map((e, i)=>{
                    var td = document.createElement('td');
                    tr.appendChild(td);
                    arr.push(0);
                })
        })
    
        tetrisTable.appendChild(fragment);
}
function addBlockClass(){
    tetrisData.forEach((tr, i)=>{
        tr.forEach((td,j)=>{
            tetrisTable.children[i].children[j].className = blocks[td][0];
        })
    })
}


function generateBlock(){
    var block = blocks[Math.floor(Math.random()*7+1)][2];
    stopDown=false;
    block.forEach((x,i)=>{
        x.forEach((xy,j)=>{
            tetrisData[i][j+3] = xy;
        })
    })
    addBlockClass();
}

//event functions
function lotateBlock(){
    console.log(tetrisData);
    console.log('lotateBlock');
}
function moveLeft(){
    console.log('moveLeft');
}
function moveRight(){
    console.log('moveRight');
    
}
function dropBlock(){
    generateBlock();
    console.log('dropBlock');
}

function moveDown(){
    console.log('moveDown');
    let count =0;


    for(var i=tetrisData.length-1; i>=0; i--){
        tetrisData[i].forEach((data,j)=>{
            if(data>0 && data <10){
                if(tetrisData[i+1] &&!stopDown &&!tetrisData[i+1][j]){
                    tetrisData[i+1][j] = data;
                    tetrisData[i][j]=0;
                }else{
                    stopDown=true;
                    tetrisData[i][j]*=10;
                }
            }
        })
    }

   

    if(stopDown)
    {  generateBlock(); }
    // console.log(tetrisData);
    addBlockClass();
}
createTetrisTable();
function StartGame(){
    
    if(isGameOver){
        generateBlock();
        interval= setInterval(moveDown, 1*100); 
        isGameOver=false;
    }

}
function PauseResume(){
    if(isPaused){
       interval = setInterval(moveDown, 1*100); 
       isPaused=false;
    
    }else{ 
        clearInterval(interval);
        isPaused=true;
    }
}
            