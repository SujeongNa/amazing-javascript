var  mainTable= document.getElementById('main-table');
var level={
    size:0, 
    bombs:0,
    //bombs - flags.length;:40,
    //easy: 15,10
    //medium: 20,40
    //hard: 25,90
}
var cell={
    '-1':'bomb',
    0:'green',
    1:'blue',
    2:'red',
    3:'violet',
    4:'yellow',
    5:'pink',
    6:'dimgray',
    7:'navy',
    8:'gray',
    
    'flag':'flag',
}

var isGameOver=false;
var dataTable=[];

function createHtmlTable(){
    const select = document.getElementById('select-level');
    //console.log(select.children[1].selected);

    
     for(var i=0; i<select.children.length;i++){
         if(select.children[i].selected){

             level.size = parseInt(select.children[i].value , 10);
             switch(level.size){
                case 15: level.bombs=10; break;
                case 25:level.bombs=90; break;
                    default:level.bombs=40; break;
                }
            }
     }




    var fragment = document.createDocumentFragment();
     dataTable=[];
    [...Array(level.size).keys()].map((row)=>
      {
          var tr = document.createElement('tr');
          var arr=[];

          [...Array(level.size).keys()].map((col)=>{
              var td = document.createElement('td');
              td.id='r'+row+'c'+col;
              tr.appendChild(td);
              arr.push(0);
          })
          fragment.appendChild(tr);
          dataTable.push(arr);


      }
    );
    
    mainTable.appendChild(fragment);
   
    const iFlag= document.getElementById('i-flag');
    const span = document.createElement('span');
    span.innerHTML= level.bombs;
    span.id='flag-count'
    iFlag.appendChild(span);

    addEventListners(); //onclick, oncontextmenu
}

function addEventListners(){ 
    const iRedo =document.getElementById('i-redo');
    iRedo.addEventListener('click', onClickRedo);

    const select = document.getElementById('select-level');
    select.addEventListener('change', onChangeLevel);
    //console.log(this);
    
    const popup = document.getElementById('popup');
    popup.classList.toggle('toggle'); //initial set to hidden

    if(!isGameOver){
    var tds = document.getElementsByTagName('td');
        for(let i=0; i<tds.length; i++){
            tds[i].addEventListener('click', onClickCell);//onlick
            tds[i].addEventListener('contextmenu', onRightClickCell);//onrightclick
          
        }
    }


    
}

function onChangeLevel(){
    console.log('selected');

    isGameOver=true;
    removeAllElements();
   
   
    gameStart();
   // console.log(this.value);
}
function countFlags(){

    const restFlags = level.bombs - document.getElementsByClassName('flag').length;
    const iFlag= document.getElementById('flag-count');
    
    iFlag.innerHTML = restFlags;
   
}
function onRightClickCell(e){//ontextmenu callback
     e.preventDefault();// prevent default browser action - open ontextmenu

     if(this.innerHTML===''&&this.className===''){
     //   console.log(this); //HTMLCollection(1) 0:i.fas fa-flag
       // if(true){//add flag
            flag =document.createElement('i');
            flag.className='fas fa-flag';
            this.appendChild(flag);
            this.className=cell['flag'];        
        //}
    }
    else{
        if(this.className==='flag'){
            this.children[0].remove();
            this.className='';
        }
    }
    countFlags();
    showResult();
}

function onClickRedo(){
    isGameOver=true;
    removeAllElements();
    gameStart();
}
function removeAllElements(){

    //remove
    const iRedo =document.getElementById('i-redo');
    iRedo.removeEventListener('click', onClickRedo);

    const select = document.getElementById('select-level');
    select.removeEventListener('change', onChangeLevel);
    
    const popup = document.getElementById('popup');
    popup.className='';

    //remove  event listner of all <td>
    if(isGameOver===true){
    var tds = document.getElementsByTagName('td');
    for(let i=0; i<tds.length; i++){
        tds[i].removeEventListener('click', onClickCell);
        tds[i].removeEventListener('contextmenu', onRightClickCell);
    }}

    //remove all tags
    const iFlag= document.getElementById('i-flag');
    iFlag.children[0].remove();

    const main = document.getElementById('main-table');
    for(var i=main.children.length-1 ;i>=0;i--){
        for(var j=main.children[i].children.length-1 ; j>=0 ;j--){
            console.log(main.children[i].children[j]);
            main.children[i].children[j].remove();
        }
        main.children[i].remove();
    }
}
function onClickCell(e){//onclick callback 
    const tmp = this.id.split('c');
    const x = tmp[0].split('r')[1];
    const y =tmp[1];
    
    if(this.className===''){
        this.removeEventListener('click', onClickCell);//remove a eventlistner when <td> is clicked
   
    dataTable.map((r,i)=>{
        r.map((c,j)=>{
            if(x==i && y==j){
               // if(this.children.length===0){
                    const c= dataTable[i][j];

                    if(c===-1){//bomb
                        const bomb =document.createElement('i');
                        bomb.className='fas fa-bomb';
                        this.appendChild(bomb);
                        isGameOver=true;             
                    }else if(c===0){//if 0, extend the cell
                        extendNearMe(x,y);
                    }
                    else{
                        this.innerHTML=c;//if not(0&&bomb)
                    }
                    this.className=cell[c]; //add css class to change color for all
                }
                
                }
                
           // }
            )
        }) }
    showResult(); 
}



function showResult(){
    const popup = document.getElementById('popup');

    //user lose
    if(isGameOver){//if game is over 
        popup.classList.toggle('toggle');
        popup.children[0].innerHTML='<i class="fas fa-bomb"> <i> you lose, try gain!';
     //   bomb.className='fas fa-bomb';
    }
    

    const tds = document.getElementsByTagName('td');
    var num = 0;
    for(var i=0; i<tds.length;i++){
            if(tds[i].className!==''){
                num++;//check all <td> if each <td> has className
        }
    }

    //user win
    if(!isGameOver&&num===level.size*level.size){
        popup.classList.toggle('toggle');
        popup.children[0].innerHTML='<i class="fa fa-flag"> <i>congratulate, you win!';
        isGameOver=true;
    }

}
function extendNearMe(i,j){

    const top = i-1; //-1
    const bottom = parseInt(i)+1;//1
    const left = j-1; //-1
    const right = parseInt(j)+1;//1

    if(left>=0){
        drawBlockByPosition(i,left);
    }
    if(right<level.size){drawBlockByPosition(i,right);}
    if(top>=0){
        drawBlockByPosition(top,j);
        if(left>=0){drawBlockByPosition(top,left);}
        if(right<level.size){drawBlockByPosition(top,right);}
    }
    if(bottom<level.size){
        drawBlockByPosition(bottom,j);
        if(left>=0){drawBlockByPosition(bottom,left);}
        if(right<level.size){drawBlockByPosition(bottom,right);}

    }
}

function drawBlockByPosition(x,y){
    var data = dataTable[x][y];
    if(data!==-1){//when data is not bomb
        const td= document.getElementById('r'+x+'c'+y);
        td.removeEventListener('click', onClickCell);
        if(td.className===''){
            td.className = cell[data];   
            if(data!==0){
                td.innerHTML = data;
            }else{           
                extendNearMe(x,y);
           }
        }
    }
}



const createData=()=>{
    //0 ... level.size-1
    var x;
    var y;
    var count=0;
    
    while(count<level.bombs){
        x = Math.floor(Math.random()*level.size);
        y =  Math.floor(Math.random()*level.size);

      dataTable.forEach((row,i)=> {
        row.forEach((col, j) => {
            if(x===i &&y===j&&dataTable[i][j]!==-1){//should check if data is already bomb
                dataTable[i][j] =-1;
                count++; //number of bombs++

            }
        });
    });}
    

    dataTable.forEach((row,i)=>{
        row.forEach((col,j)=>{
            const data = dataTable[i][j];
            if(data===-1){//if data is bomb, addup count near bomb
                //i,j
                const top = i-1;
                const bottom = i+1;
                const left = j-1;
                const right = j+1;
            
            if(top>=0){
                if(left>=0 && dataTable[top][left]!==-1) dataTable[top][left]++;
                if(dataTable[top][j]!==-1) dataTable[top][j]++;
                if(right<level.size &&dataTable[top][right]!==-1) dataTable[top][right]++;
                
            }
            if(left>=0){
                if(dataTable[i][left]!==-1) dataTable[i][left]++;
            }
            if(right<level.size){
                if(dataTable[i][right]!==-1) dataTable[i][right]++;
            }
            if(bottom<level.size){
                if(left>=0&&dataTable[bottom][left]!==-1) dataTable[bottom][left]++;
                if(right<level.size&& dataTable[bottom][right]!==-1)dataTable[bottom][right]++;
                if(dataTable[bottom][j]!==-1)dataTable[bottom][j]++;
            }
           }
        })
    })
    
    let numbs = 0;
    dataTable.map((row,i)=>{
        row.map((col,j)=>{
            if(dataTable[i][j]===-1){
                numbs++;
            }
        })
    })

    console.log(dataTable);
    console.log(numbs);
}


function gameStart(){
    isGameOver=false;
    createHtmlTable();
    createData();
    

}

gameStart();

