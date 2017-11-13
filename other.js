//localStorage用来存储客户端记录
if(!localStorage.m1){localStorage.m1=Number.MAX_VALUE};
if(!localStorage.m2){localStorage.m2=Number.MAX_VALUE};
if(!localStorage.m3){localStorage.m3=Number.MAX_VALUE};
var flagg;
var mc=1;
var count=0;
window.onload=function(){
  var s=new SaoLei(9,9,10);
  setLevel();
  setTime();
}
//设置级别
function setLevel(){
  var level=document.getElementsByClassName("level")[0];
  level.value=1;
  level.onchange=function(){
    if(level.value==1){
      var s=new SaoLei(9,9,10);
      mc=1;
    }
    if(level.value==2){
      var s=new SaoLei(16,16,40);
      mc=2;
    }
    if(level.value==3){
      var s=new SaoLei(16,30,90);
      mc=3;
    }
  }
}
//设置时间
function setTime(){
  var btn=document.getElementsByClassName("btn");
  for(var i=0;i<2;i++){
    (function(s){
      btn[s].onclick=function(){
        if(s==1){
          window.location.reload();
        }
        if(s==0){
          begin();
        }
      }
    })(i);
  }
  //点击开始游戏后的开始函数
  function begin(){
    if(!flagg){
      flagg=true;
    }
    var time=document.getElementsByClassName("time")[0];
    document.getElementsByClassName("btn")[0].disabled="true";
    timer=setInterval(function(){
      count++;
      time.innerHTML=count;
    },1000);
  }
}
function SaoLei(row,cell,number){
  //创建div框，设置宽高，并定义一些基本元素
  this.root=document.createElement("div");
  this.root.setAttribute("id","saolei");
  this.row=row;
  this.cell=cell;
  this.number=number;
  this.bird=[];//整体的二维数组
  this.win=row*cell-number;
  this.count=0;
  this.init();
}
//获取父元素节点
function getParent(o){
  if(o.parentNode.nodeType==1){
    return o.parentNode;
  }
  else{
    return getParent(o.parentNode);
  }
}
SaoLei.prototype={
  init:function(){
    var self=this;
    var markNum=document.getElementsByClassName("markNum")[0];
    markNum.innerHTML=self.number;
    //扫雷整体轮廓图的构建
    var main=document.getElementsByClassName("main")[0];
    main.innerHTML="";
    this.root.style.cssText="height:"+this.row*20+"px;width:"+this.cell*20+"px;";
    main.appendChild(this.root);
    for(var i=0;i<this.row;i++)
    {
      var arr=[];
      for(var j=0;j<this.cell;j++)
      {
        var dP=document.createElement("p");
        dP.setAttribute("data-num",0);
        dP.setAttribute("data-pos",i+","+j);
        dP.onmousedown=function(){//点击内层触发的函数
          if(!this.flag){
            this.flag=true;
          }
          var x=self.getXY(this)[0];
          var y=self.getXY(this)[1];
          arra=self.flagNum(x,y);
          //当周围的雷排出时，点亮周围并拓展周围
          if(self.getNum(self.getXY(this)[0],self.getXY(this)[1])==arra[0]){
            for(var z=0;z<arra[1].length;z++){
              arra[1][z].getElementsByTagName("span")[0].style.display="none";
              self.count++;
              if(arra[1][z].className=="lei"){
                alert("you lose");
                clearInterval(timer);
                return ;
              }
            }
            for(var z=0;z<arra[1].length;z++){
              if(self.getNum(self.getXY(arra[1][z])[0],self.getXY(arra[1][z])[1])==0){
                self.bE(arra[1][z]);
              }
              if(self.count==self.win){
                alert("you win 用时:"+count+"秒");
                clearInterval(timer);
                self.break();
                return ;
              }
            }
          }
          else{
            for(var i=0;i<arra[1].length;i++){
              arra[1][i].getElementsByTagName("span")[0].classList.add("liang");
            }
          }
        }
        dP.onmouseup=dP.onmousemove=function(){
            if(this.flag){
              console.log(arra[1].length);
              for(var i=0;i<arra[1].length;i++){
                arra[1][i].getElementsByTagName("span")[0].classList.remove("liang");
              }
            }
            this.flag=false;
        }
        var dSpan=document.createElement("span");
        dSpan.onmousedown=function(event){
          event.stopPropagation();
          if(!flagg){
            alert("请先开始游戏");
            return;
          }
          var btnNum=event.button;
          var lei=getParent(this);
          if(btnNum==2){
            this.classList.toggle("yellow");
          }
          else if(btnNum==0){
            if(this.className=="yellow"){
              this.className="";
              return ;
            }
            if(lei.className=="lei"){
              alert("you lose");
              clearInterval(timer);
              return ;
            }
            var pos=self.getXY(this);
            this.style.display="none";
            self.count++;
            if(self.getNum(pos[0],pos[1])==0){
              self.bE(this);
            }
            if(self.count==self.win){
              alert("you win 用时:"+count+"秒");
              clearInterval(timer);
              self.break();
              return ;
            }
          }
        }
        dP.appendChild(dSpan);
        this.root.appendChild(dP);
        arr.push(dP);
      }
      this.bird.push(arr);//二维数组来存储所有ｐ元素
    }
    for(var i=0;i<this.number;i++)
    {
      this.createLei();
    }
  },
  //判断是否打破记录
  break:function(){
    if(mc==1){
      if(count<localStorage.m1){
        alert("恭喜你打破记录");
        localStorage.m1=count;
      }
    }
    if(mc==2){
      if(count<localStorage.m2){
        alert("恭喜你打破记录");
        localStorage.m2=count;
      }
    }
    if(mc==3){
      if(count<localStorage.m3){
        alert("恭喜你打破记录");
        localStorage.m3=count;
      }
    }
  },
  //左键按下时获取标记数，未标记数
  flagNum:function(x,y){
    var self=this;
    var array=[];
    var num=0;
    var arr=self.roundBird(x,y);
    console.log(arr.length);
    arr.forEach(function(ele,index){
      console.log(ele);
      if(ele.getElementsByTagName("span")[0].className=="yellow"){
        num++;
      }
      else if(ele.getElementsByTagName("span")[0].style.display!="none")
      {
        var pos=self.getXY(ele);
        array.push(self.bird[pos[0]][pos[1]]);
      }
    });
    return [num,array];
  },
  //由一个点点亮周围点
  bE:function(o){
    var self=this;
    var pos=self.getXY(o);
    var x=pos[0];var y=pos[1];
    //利用创建对象标记走过的点
    if(!this.cache){this.cache={}}
    if(!this.cache[x+'-'+y]){
      this.cache[x+'-'+y]=1;
    }
    else{
      return ;
    }
    var arr=self.roundBird(pos[0],pos[1]);
    arr.forEach(function(ele,index){
      if(ele.getElementsByTagName("span")[0].style.display!='none'){
        ele.getElementsByTagName("span")[0].style.display='none';
        self.count++;
      }
      if(ele.getAttribute("data-num")==0){
        //console.log(ele);
        self.bE(ele);
      }
    });
  },
  //获取位置ｘｙ
  getXY:function(o){
    var o= o.nodeName=="P"?o:getParent(o);
    var s=o.getAttribute("data-pos");
    var pos=s.split(",");
    return [parseInt(pos[0]),parseInt(pos[1])];
  },
  createLei:function(){//创造雷的过程
    var row=Math.floor(Math.random()*this.row);
    var cell=Math.floor(Math.random()*this.cell);
    if(this.bird[row][cell].className!="lei"){
      this.bird[row][cell].className="lei";
      this.updataNum(row,cell);
    }
    else{
      this.createLei();
    }
  },
  roundBird:function(x,y){
      var arr=[];
      var self=this;
      function isExist(x,y){
        if(self.bird[x]!=undefined&&self.bird[x][y]!=undefined){
          arr.push(self.bird[x][y]);
        }
      }
      isExist(x,y+1);isExist(x,y-1);isExist(x+1,y);isExist(x-1,y);
      isExist(x+1,y+1);isExist(x-1,y+1);isExist(x+1,y-1);isExist(x-1,y-1);
      return arr;
  },
　updataNum:function(row,cell)//产生一个雷后，更新周围有雷的数量
  {
    var self=this;
    function leiNum(x,y){
      if(self.bird[x]!=undefined&&self.bird[x][y]!=undefined){
        self.bird[x][y].setAttribute("data-num",self.getNum(x,y)+1);
      }
    }
    leiNum(row+1,cell);
    leiNum(row-1,cell);
    leiNum(row,cell+1);
    leiNum(row,cell-1);
    leiNum(row+1,cell+1);
    leiNum(row-1,cell-1);
    leiNum(row+1,cell-1);
    leiNum(row-1,cell+1);
  },
 getNum:function(x,y){
   return parseInt(this.bird[x][y].getAttribute("data-num"));
 }
}
