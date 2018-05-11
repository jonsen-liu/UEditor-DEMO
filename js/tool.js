/**
 * Created by Administrator on 2017/8/24.
 */
var tool = {
    // idApi: "DESKTOP-IP4KFHU",//API地址
    getUUID:function (len, radix) {//len传入自己想要设置的ID长度，radix传入自己想要设置ID进制（二进制，10进制，16进制）
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [];
        radix = radix || chars.length;
        if (len) {
            for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
            var n;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (var j = 0; j < 36; j++) {
                if (!uuid[j]) {
                    n = 0 | Math.random()*16;
                    uuid[j] = chars[(j == 19) ? (n & 0x3) | 0x8 : n];
                }
            }
        }
        return uuid.join('');
        // 8 character ID (base=2)
        // uuid(8, 2)  //  "01001010"
        // 8 character ID (base=10)
        // uuid(8, 10) // "47473046"
        // 8 character ID (base=16)
        // uuid(8, 16) // "098F4D35"
    },
    getUrlParam: function getUrlParam(name) {//获取Url的参数
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return decodeURI(r[2]);
        return null;
    },
    getMyPropertyValue:function (str) {
        var obj = {};
        var arr007 = [];
        var arr = [];
        var num;
        var result = str.match(/<[A-Za-z]+\s[^>]+idtype=".*?".*?>/g);//正则匹配到所有的组件
        for (var i = 0 ; i < result.length;i++){
            arr007 = result[i].match(/[A-Za-z]+=\".*?\"/g);
            for(var j = 0 ; j < arr007.length; j++){
                var str13 = arr007[j];
                num = str13.indexOf("=");
                var qName = str13.slice(0, num);//截取到的属性名
                var hValue = str13.slice(num+1);//截取到的属性值
                hValue = hValue.replace(/\"|\'/g,"");
                obj[qName]=hValue;
            }
            arr.push(obj);
            obj={};
        }
        // console.log(arr);
        return arr;
    },
    getMyAjax:function (url) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send();
        xhr.onreadystatechange = function () {
            var XMLHttpReq = xhr;
            if (XMLHttpReq.readyState == 4) {
                console.log(XMLHttpReq.status);
                if (XMLHttpReq.status == 200) {
                    console.log("OK");
                    console.log(XMLHttpReq.response);
                    return XMLHttpReq.response;
                } else {
                    if (XMLHttpReq.status == 404) {
                        alert("404")
                    }
                }
            }
        };
    },
    getFormeditor:function (str) {
        // console.log(str);
        var formeditor = str;
        formeditor = formeditor.replace(/\<u\s+style\=\"width\:\s+[0-9]+px\;\"\>\<\/u\>/g, "&nbsp;");
        formeditor = formeditor.replace(/(orgfontsize|orgheight|orgwidth)=("[0-9]+"|"")/g, "");
        formeditor = formeditor.replace(/class="leipiplugins"|leipiplugins=("[A-Za-z0-9]+"|"")/g, "");

        var str14 = formeditor.match(/<a draggable="true">.*?<\/a>/g);
        if(str14!=null){
            for(var k = 0 ;k <str14.length;k++){
                var isThis = str14[k].replace(/<a draggable="true">/g,'');
                isThis = isThis.replace(/<\/a>/g,'');
                formeditor = formeditor.replace(/<a draggable="true">.*?<\/a>/, isThis);
            }
        }

        if(formeditor.search(/<input[^>]+id="isReplace".*?>/g)!=-1){
            formeditor=formeditor.replace(/<input[^>]+id="isReplace".*?>/g,"");
            //将所有的table tr td 替换为div
            $(function () {
                var $formeditorEl = $("<div></div>");
                $formeditorEl.attr({
                    "id":"myReplace",
                    "style":"display:none"
                });
                $formeditorEl.html(formeditor);
                $("body").eq(0).append($formeditorEl);
                var $isTableFather = $("#myReplace");
                var isTables = $isTableFather.children("table");
                $.each(isTables,function (i,v) {//table层
                    if($(v).prop("nodeName")=="TABLE"){//此处是匹配到table标签
                        var $divTa=$("<div class='_table container-fluid'></div>");
                        var $table = $(v);
                        var $tbody = $table.children();
                        $.each($tbody,function (i, v) {//tbody层
                            var $divTb=$("<div class='_tbody'></div>");
                            var $tr = $(v).children();
                            $.each($tr,function (i, v) {//tr层
                                var $divTr=$("<div class='_tr row-fluid'></div>");
                                var $td = $(v).children();
                                var $tdLen = $td.length;
                                $.each($td,function (i, v) { // td层
                                    var $divTd = $("<div class='_td span"+ (12 / $tdLen) +"'></div>");//创建新标签
                                    var oldEl = $(v).html();//获取到td里面的内容
                                    $divTd.html(oldEl);
                                    $divTr.append($divTd);
                                });
                                // console.log($divTr.eq(0));
                                $divTb.append($divTr)
                            });
                            $divTa.append($divTb)
                        })
                    }
                    $(v).replaceWith($divTa);
                });

                formeditor = $("#myReplace").html();
                $("#myReplace").remove();
                // $("body").eq(0).append($divT);
            });
        }






        function xx(value) {
            return formeditor.indexOf(value);
        }
        var myDate = tool.getMyPropertyValue(formeditor);//此处获取的是所有控件的必要属性
        myDate.unshift(tool.getUUID(64,16));
        if(xx('type="button"')!= -1){
            formeditor+='<script>var verify=document.getElementById("verify");var ifVerify;if(verify==null){ifVerify=false}else{var verifySon=verify.children;for(var i=0;i<verifySon.length;i++){verifySon[i].onclick=function(){if(this.value=="校验"){ifVerify=true}else{ifVerify=false}}}ifVerify=true}var modalBox=document.getElementById("modalBox");var modalBoxBody=document.getElementById("modalBoxBody");var X=document.getElementById("X");var cancel=document.getElementById("cancel");var confirm=document.getElementsByClassName("confirm")[0];modalBoxFather.onclick=function () {this.style.display = \"none\";modalBoxBody.innerHTML = \"\";};modalBox.onclick=function(e){e.stopPropagation();};X.onclick=function(){modalBoxFather.style.display="none";modalBoxBody.innerHTML="";confirm.setAttribute("id","")};cancel.onclick=function(){modalBoxFather.style.display="none";modalBoxBody.innerHTML="";confirm.setAttribute("id","")};var mouseX;var mouseY;var elX;var elY;var moveBox=false;modalBoxMove.onmousedown=function(e){moveBox=true;mouseX=e.clientX;mouseY=e.clientY;elX=e.offsetX;elY=e.offsetY;modalBox.style.transform="none";modalBox.style.top=mouseY-elY+"px";modalBox.style.left=mouseX-elX+"px"};modalBoxMove.onmouseup=function(){moveBox=false};document.onmousemove=function(e){if(moveBox){modalBox.style.top=e.clientY-elY+"px";modalBox.style.left=e.clientX-elX+"px"}};</script>'
            if (formeditor.indexOf('id="entering"') != -1) {
                formeditor+='<script>var entering=document.getElementById("entering");entering.onclick=function(){confirm.setAttribute("id","confirm");var myHtml="<p style=text-align:center>URL: <input type=text placeholder=请输入AJAX地址 id=myUrl></p>";modalBoxBody.innerHTML=myHtml;confirmFn();modalBoxFather.style.display="block";};function confirmFn() {confirm.onclick=function(){var myUrl=document.getElementById("myUrl").value;var isUrl=myUrl.replace(/\s+/,"");if(isUrl==""){return alert("请输入URL地址......")}if(ifVerify){var myTxt=document.getElementsByTagName("input");for(var i=0;i<myTxt.length;i++){var txt=myTxt[i].value;if(myTxt[i].type == \"text\"&&myTxt[i].getAttribute(\"idtype\") != undefined){txt.replace(/\s+/g,"");if(txt==""){return alert("还有内容未输入......")}}}}var xhr=new XMLHttpRequest();var url=myUrl;xhr.open("POST",url,true);xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");xhr.onreadystatechange=function(){var XMLHttpReq=xhr;if(XMLHttpReq.readyState==4){if(XMLHttpReq.status==200){console.log("OK");console.log(XMLHttpReq.response);modalBoxFather.style.display = "block";}else{if(XMLHttpReq.status==404){return alert("服务器异常或者URL路径错误，报错404")}}}};xhr.send()};}</script> '
            }
            if (formeditor.indexOf('id="remove"') != -1) {//判断是否有添加删除行按钮功能
                formeditor += '<script>var myRemove=document.getElementById(\"remove\");myRemove.onclick=function(){confirm.setAttribute(\"id\",\"removeConfirm\");var myHtml=\'<p style=\"text-align: center\"><input type=\"radio\" name=\"$radio$\" checked>行<input type=\"radio\" name=\"$radio$\">列</p><p style=\"text-align: center\">第几<span id=\"cnText\">行</span>(可以为多个请用，分开):</p><p style=\"text-align: center\"><input id=\"text\" type=\"text\"></p>\';modalBoxBody.innerHTML=myHtml;myRemoveFn();modalBoxFather.style.display=\"block\"};function myRemoveFn(){var inputs=document.getElementsByName(\"$radio$\");var flag=true;for(var i=0;i<inputs.length;i++){inputs[i].index=i;inputs[i].onclick=function(){var cnText=document.getElementById(\"cnText\");if(this.index==0){cnText.innerText=\"行\";flag=true}else{cnText.innerText=\"列\";flag=false}}}var removeConfirm=document.getElementById(\"removeConfirm\");removeConfirm.onclick=function(){var tBody=document.getElementsByTagName(\"tbody\")[0];var num=document.getElementById(\"text\").value;if(!/^[1-9]/.test(num)){return alert(\"请输入0以上的数字\")}num=num.replace(/\，/g,\",\");var arr=num.split(\",\");arr=arr.sort(function(a,b){return b-a});if(flag){for(var i=0;i<arr.length;i++){var index=arr[i];if(tBody.children[index-1]){tBody.children[index-1].remove()}else{return alert(\"没有第\"+index+\"行可以删除\")}}}else{for(var i=0;i<tBody.children.length;i++){for(var j=0;j<arr.length;j++){var index=arr[j];if(tBody.children[i].children[index-1]){tBody.children[i].children[index-1].remove()}else{return alert(\"没有第\"+index+\"列可以删除\")}}}}modalBoxFather.style.display=\"none\"}};<\/script>'
            }
            if (formeditor.indexOf('id="add"') != -1) {//判断是否有添加  添加行列按钮功能
                formeditor+='<script>var add=document.getElementById(\"add\");add.onclick=function(){confirm.setAttribute(\"id\",\"addConfirm\");var myHtml=\"<style>#modalBoxBody>div>div{float:left}#modalBoxBody > div{min-height: 100px;padding-left: 10px} #modalBoxBody select{width:75px;height:30px} #modalBoxBody h4{margin-top: 10px;} .checks{padding-top:20px;display:none}.checks>input{width:55px}b,u{display:inline-block;cursor:pointer;width:20px;text-align:center;font-size:20px}u{text-decoration:none}</style>\"+\'<div><div style=\"margin-right: 85px;\"><h4>所属:</h4><input type=\"text\" id=\"name1\"></div><div><h4>类别:</h4><select name=\"\" id=\"select1\"><option value=\"input\">输入框</option><option value=\"check\">选项框</option>\'+\'</select><select name=\"\" id=\"select2\"><option value=\"input\">文本框</option><option value=\"textarea\">多行文本框</option>\'+\'</select><div class=\"checks\"><u class=\"jianU\">-</u><input type=\"text\"><input type=\"text\">\'+\'<b class=\"jiaB\">+</b></div></div></div><div><div style=\"margin-right: 85px;\"><h4>所属:</h4><input type=\"text\" id=\"name2\"></div>\'+\'<div><h4>类别:</h4><select id=\"select3\"><option value=\"input\">输入框</option><option value=\"check\">选项框</option>\'+\'</select><select name=\"\" id=\"select4\"><option value=\"input\">文本框</option><option value=\"textarea\">多行文本框</option>\'+\'</select><div class=\"checks\"><u class=\"jianU\">-</u><input type=\"text\"><input type=\"text\"><b class=\"jiaB\">+</b></div></div></div>\';modalBoxBody.innerHTML=myHtml;modalBoxFather.style.display=\"block\";myAdd()};function myAdd(){var select1=document.getElementById(\"select1\");var select2=document.getElementById(\"select2\");var select3=document.getElementById(\"select3\");var select4=document.getElementById(\"select4\");var checks=document.getElementsByClassName(\"checks\");var b=document.getElementsByClassName(\"jiaB\");var u=document.getElementsByClassName(\"jianU\");select1.onchange=function(){checks[0].style.display=\"none\";select(select1,select2,checks[0])};select3.onchange=function(){checks[1].style.display=\"none\";select(select3,select4,checks[1])};function select(fatherSelect,sonSelect,checks){if(fatherSelect.value==\"input\"){sonSelect.innerHTML=\"<option value=input>文本框</option><option value=textarea>多行文本框</option>\"}else{if(fatherSelect.value==\"check\"){sonSelect.innerHTML=\"<option value=radio>单选</option><option value=checkbox>复选</option>\";checks.style.display=\"block\"}}}var num1=2;var num2=2;b[0].onclick=function(){num1++;setElement(this,num1)};b[1].onclick=function(){num2++;setElement(this,num2)};function setElement(that,num){var father=that.parentNode;var newObj=that.previousElementSibling.cloneNode(true);father.insertBefore(newObj,that)}u[0].onclick=function(){num1--;var that=this.parentNode;delElement(that)};u[1].onclick=function(){num2--;var that=this.parentNode;delElement(that)};function delElement(that){if(that.children.length-2<=1){return alert(\"不能删除了......\")}that.children[that.children.length-2].remove()}var addConfirm=document.getElementById(\"addConfirm\");addConfirm.onclick=function(){var name1=document.getElementById(\"name1\").value;var name2=document.getElementById(\"name2\").value;var tr=setSelect(name1,select2.value,name2,select4.value);document.getElementById(\"name1\").value=\"\";document.getElementById(\"name2\").value=\"\";var mytTbody=document.getElementsByTagName(\"tbody\")[0];mytTbody.appendChild(tr);modalBoxFather.style.display=\"none\";modalBoxBody.innerHTML=\"\"};function setSelect(name1,value1,name2,value2){var tr=document.createElement(\"tr\");var td=document.createElement(\"td\");tr.innnerHtml=td;tr=setInput(checks,tr,name1,name2,value1,value2);return tr}function setInput(checks,tr,name1,name2,value1,value2){var myTd1=document.createElement(\"td\");var myTd2=document.createElement(\"td\");myTd1.innerText=name1;myTd2=xuanZe(checks[0],value1,myTd2);var myTd3=document.createElement(\"td\");var myTd4=document.createElement(\"td\");myTd3.innerText=name2;myTd4=xuanZe(checks[1],value2,myTd4);tr.append(myTd1);tr.append(myTd2);tr.append(myTd3);tr.append(myTd4);return tr}function xuanZe(checks,value,myTd){if(value==\"input\"){var son=document.createElement(value);son.setAttribute(\"type\",\"text\");myTd.appendChild(son)}else{if(value==\"textarea\"){var son=document.createElement(value);myTd.appendChild(son)}else{if(value==\"radio\"){var elemt=checks.children;for(var i=1;i<elemt.length-1;i++){var span=document.createElement(\"span\");span.innerText=elemt[i].value;var son=elemt[i].cloneNode(true);son.setAttribute(\"type\",\"radio\");son.setAttribute(\"name\",\"radio\");myTd.appendChild(son);myTd.appendChild(span)}}else{if(value==\"checkbox\"){var elemt=checks.children;for(var i=1;i<elemt.length-1;i++){var span=document.createElement(\"span\");span.innerText=elemt[i].value;var son=elemt[i].cloneNode(true);son.setAttribute(\"type\",\"checkbox\");son.setAttribute(\"name\",\"checkbox\");myTd.appendChild(son);myTd.appendChild(span)}}else{alert(\"逻辑出错\")}}}}return myTd}};<\/script>'
            }
            if (formeditor.indexOf('id="move"') != -1) {//判断是否有添加 移动按钮
                formeditor+='<script>var tBody=document.getElementsByTagName(\"tbody\")[0];var move=document.getElementById(\"move\");move.onclick=function(){confirm.setAttribute(\"id\",\"moveConfirm\");var myHtml=\'<style>#modalBoxBody > p {text-align: center;}</style><p>移动</p><p>第<input type=\"text\" class=\"moveBoxTxt\">行</p> <p>到</p> <p>第<input type=\"text\" class=\"moveBoxTxt\">行</p>\';modalBoxBody.innerHTML=myHtml;moveFn();modalBoxFather.style.display=\"block\"};function moveFn(){var moveConfirm=document.getElementById(\"moveConfirm\");moveConfirm.onclick=function(){var moveBoxTxts=document.getElementsByClassName(\"moveBoxTxt\");for(var i=0;i<moveBoxTxts.length;i++){moveBoxTxts[i].onblur=function(){if(/\\D|^0/g.test(this.value)){this.value=\"\";this.focus();return alert(\"请输入1-9的纯数字\")}}}if(!moveBoxTxts[0].value||!moveBoxTxts[1].value){return alert(\"请输入完整\")}if(!tBody.children[moveBoxTxts[0].value-1]||!tBody.children[moveBoxTxts[1].value-1]){return alert(\"请输入正确的行数\")}if(moveBoxTxts[0].value<moveBoxTxts[1].value){tBody.insertBefore(tBody.children[moveBoxTxts[0].value-1],tBody.children[moveBoxTxts[1].value])}else{tBody.insertBefore(tBody.children[moveBoxTxts[0].value-1],tBody.children[moveBoxTxts[1].value-1])}modalBoxFather.style.display=\"none\";modalBoxBody.innerHTML=\"\"}};<\/script>'
            }
            if (formeditor.indexOf('idtype="shu"') != -1) {//判断是否有树结构

                var shuNum = 0;
                var i = 0;
                // var k = 0;
                while(true){
                    var randomNum =parseInt(Math.random()*1000);
                    var numShu12 = formeditor.indexOf('idtype="shu"',shuNum);
                    if(numShu12!=-1){
                        shuNum = numShu12+1;
                    }else {
                        // flagShu = false;
                        break;
                    }
                    var shuWidth, shuHeight,CRUD,shuId,shuShow;
                    for (; i < myDate.length; i++) {
                        // console.log(myDate.length);
                        // console.log(i);
                        if (myDate[i].shuwidth) {
                            shuWidth = myDate[i].shuwidth;
                        }
                        if (myDate[i].shuheight) {
                            shuHeight = myDate[i].shuheight;
                        }
                        if (myDate[i].id) {
                            shuId = myDate[i].id;
                        }
                        if (myDate[i].shushow) {
                            shuShow = parseInt(myDate[i].shushow);
                        }
                        if (myDate[i].crud) {
                            CRUD = myDate[i].crud;
                            i++;
                            break;
                        }
                    }
                    var indexNum = formeditor.indexOf('>', numShu12) + 1;
                    // console.log(shuWidth);
                    // console.log(shuHeight);
                    // console.log(CRUD);
                    // console.log(shuId);
                    // console.log(shuShow);
                    // debugger;
                    var aMyHTML = ' <style>#contentBox'+ randomNum +'{display:none;}.treeBox'+ randomNum +'{border:1px solid rgba(0,0,0,0.1);overflow:auto;width:'+(shuWidth==undefined?"100%":(shuWidth+"px") ) + ';height:'+ (shuHeight==undefined?"100%": (shuHeight+"px")) + '}.treeBox'+ randomNum +'::-webkit-scrollbar{width:4px;height:4px}.treeBox'+ randomNum +'::-webkit-scrollbar-thumb{border-radius:5px;-webkit-box-shadow:inset 0 0 5px rgba(0,0,0,0.2);background:rgba(0,0,0,0.2)}.treeBox'+ randomNum +'::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 5px rgba(0,0,0,0.2);border-radius:0;background:rgba(0,0,0,0.1)}.ztree li span.button.add{margin-left:2px;margin-right:-1px;background-position:-144px 0;vertical-align:top;*vertical-align:middle}</style>'+
                        '<div class=\"contentBox'+ randomNum +'\" id=\"contentBox'+ randomNum +'\"><div><div class=\"treeBox'+ randomNum +'\"><ul id=\"tree1'+ randomNum +'\" class=\"ztree\" ></ul></div></div></div>'+
                        '<script>var getDataUrl=\"http:\/\/192.168.2.31:8444\/spring-boot\/area\/getAll\";var addDataUrl=\"http:\/\/192.168.2.31:8444\/spring-boot\/area\/add\";var deleteDataUrl=\"http:\/\/192.168.2.31:8444\/spring-boot\/area\/delete\";var updateDataUrl=\"http:\/\/192.168.2.31:8444\/spring-boot\/area\/update\";var chkStyle=\"checkbox\";var radioType=\"all\";var chkboxType={\"Y\":\"ps\",\"N\":\"ps\"};function onCheck'+ randomNum +'(e,treeId,treeNode){var treeObj=$.fn.zTree.getZTreeObj(\"tree1'+ randomNum +'\");var nodes=treeObj.getCheckedNodes(true);var arr=[];for(var i=0;i<nodes.length;i++){var nodeVal=nodes[i];if(nodeVal.children==undefined){var level=nodeVal.level;var txt=nodeVal.name;var parentVal=nodeVal.getParentNode();for(var j=0;j<level;j++){txt=parentVal.name+\"\/\"+txt;parentVal=parentVal.getParentNode()}arr.push(txt)}}console.log(arr)}function onDblClick'+randomNum+'(e,treeId,treeNode,clickFlag){clearTimeout(timeClick);var treeObj=$.fn.zTree.getZTreeObj(\"tree1'+ randomNum +'\");if(treeNode!=null){treeObj.checkNode(treeNode,!treeNode.checked,true);treeObj.checkNode(treeNode,treeNode.checked,false)}onCheck'+ randomNum +'()}var timeClick;function onNodeClick'+ randomNum +'(e,treeId,treeNode){clearTimeout(timeClick);timeClick=setTimeout(function(){var zTree=$.fn.zTree.getZTreeObj("tree1'+ randomNum +'");zTree.expandNode(treeNode);clearTimeout(timeClick)},230)};var zTree;var setting'+ randomNum +'={async:{enable:true,type:\"get\",url:getDataUrl,dataFilter:ajaxDataFilter},view:{dblClickExpand:false,showLine:true,selectedMulti:false,'+ (CRUD==0?('addHoverDom:addHoverDom,removeHoverDom:removeHoverDom'):"")+'},data:{simpleData:{enable:true,idKey:\"id\",pIdKey:\"pid\",rootPId:\"\"}},check:{enable:true,chkStyle:chkStyle,radioType:radioType,chkboxType:chkboxType},edit:{renameTitle:\"编辑节点名称\",'+(CRUD==0?('enable:true,showRenameBtn:true,showRemoveBtn:true'):"")+'},callback:{onClick:onNodeClick'+ randomNum +',beforeCheck:true,onCheck:onCheck'+ randomNum +',beforeRename:zTreeBeforeRename,onDblClick:onDblClick'+ randomNum +',}};$(document).ready(function(){$.fn.zTree.init($(\"#tree1'+ randomNum +'\"),setting'+ randomNum +')});function ajaxDataFilter(treeId,parentNode,responseData){if(responseData.code==\"success\"){var data=responseData.data}return data}function addHoverDom(treeId,treeNode){var sObj=$(\"#\"+treeNode.tId+\"_span\");if(treeNode.editNameFlag||$(\"#addBtn_\"+treeNode.tId).length>0){return}var addStr=\"<span class=\'button add\' id=\'addBtn_\"+treeNode.tId+\"\' title=\'添加子节点\' onfocus=\'this.blur();\'><\/span>\";sObj.after(addStr);var addBtn=$(\"#addBtn_\"+treeNode.tId);if(addBtn){addBtn.bind(\"click\",function(){var zTree=$.fn.zTree.getZTreeObj(\"tree1'+ randomNum +'\");$.ajax({url:addDataUrl,type:\"post\",dataType:\"json\",contentType:\"application\/json\",data:JSON.stringify({pid:treeNode.id,name:\"demo\"}),success:function(data){var newId=data.data.id;var newnade={id:newId,name:\"demo\"};zTree.addNodes(treeNode,newnade);zTree.updateNode(treeNode)},error:function(data){}});return false})}var delBtn=$(\"#\"+treeNode.tId+\"_remove\");if(delBtn){delBtn.bind(\"click\",function(){$.ajax({url:deleteDataUrl,type:\"post\",dataType:\"json\",contentType:\"application\/json\",data:JSON.stringify({id:treeNode.id}),success:function(data){},error:function(data){}})})}}function removeHoverDom(treeId,treeNode){$(\"#addBtn_\"+treeNode.tId).unbind().remove()}function zTreeBeforeRename(treeId,treeNode,newName,isCancel){$.ajax({url:updateDataUrl,type:\"put\",dataType:\"json\",contentType:\"application\/json\",data:JSON.stringify({id:treeNode.id,name:newName}),success:function(data){},error:function(data){}})};<\/script><\/div>'+
                        '<script>var '+ shuId +' = document.getElementById("'+ shuId +'");var contentBox'+ randomNum +' = document.getElementById("contentBox'+ randomNum +'");'+ shuId +'.onclick=function () {var computedStyle = document.defaultView.getComputedStyle(contentBox'+ randomNum +',null);var Afalg = contentBox'+ randomNum +'.style.display;if(Afalg=="none"||Afalg==""){contentBox'+ randomNum +'.parentNode.style.height=parseInt(computedStyle.height)+50+"px";contentBox'+ randomNum +'.style.display="block";}else {contentBox'+ randomNum +'.style.display="none";contentBox'+ randomNum +'.parentNode.style.height = null;}}<\/script>';

                    var myArr01 = formeditor.slice(0, indexNum);
                    var myArr02 = formeditor.slice(indexNum);
                    if(shuShow){
                        var bMyHtml = ' <div><style>.treeBox'+ randomNum +'{border:1px solid rgba(0,0,0,0.1);overflow:auto;width:'+(shuWidth==undefined?"100%" :(shuWidth+"px")) + ';height:'+ (shuHeight==undefined?"100%":(shuHeight+"px") ) + '}.treeBox'+ randomNum +'::-webkit-scrollbar{width:4px;height:4px}.treeBox'+ randomNum +'::-webkit-scrollbar-thumb{border-radius:5px;-webkit-box-shadow:inset 0 0 5px rgba(0,0,0,0.2);background:rgba(0,0,0,0.2)}.treeBox'+ randomNum +'::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 5px rgba(0,0,0,0.2);border-radius:0;background:rgba(0,0,0,0.1)}.ztree li span.button.add{margin-left:2px;margin-right:-1px;background-position:-144px 0;vertical-align:top;*vertical-align:middle}</style>'+
                            '<div class=\"contentBox'+ randomNum +'\" id=\"contentBox'+ randomNum +'\"><div><div class=\"treeBox'+ randomNum +'\"><ul id=\"tree1'+ randomNum +'\" class=\"ztree\" ></ul></div></div></div>'+
                            '<script>var getDataUrl=\"http:\/\/192.168.2.31:8444\/spring-boot\/area\/getAll\";var addDataUrl=\"http:\/\/192.168.2.31:8444\/spring-boot\/area\/add\";var deleteDataUrl=\"http:\/\/192.168.2.31:8444\/spring-boot\/area\/delete\";var updateDataUrl=\"http:\/\/192.168.2.31:8444\/spring-boot\/area\/update\";var chkStyle=\"checkbox\";var radioType=\"all\";var chkboxType={\"Y\":\"ps\",\"N\":\"ps\"};function onCheck'+ randomNum +'(e,treeId,treeNode){var treeObj=$.fn.zTree.getZTreeObj(\"tree1'+ randomNum +'\");var nodes=treeObj.getCheckedNodes(true);var arr=[];for(var i=0;i<nodes.length;i++){var nodeVal=nodes[i];if(nodeVal.children==undefined){var level=nodeVal.level;var txt=nodeVal.name;var parentVal=nodeVal.getParentNode();for(var j=0;j<level;j++){txt=parentVal.name+\"\/\"+txt;parentVal=parentVal.getParentNode()}arr.push(txt)}}console.log(arr)}function onDblClick'+randomNum+'(e,treeId,treeNode,clickFlag){clearTimeout(timeClick);var treeObj=$.fn.zTree.getZTreeObj(\"tree1'+ randomNum +'\");if(treeNode!=null){treeObj.checkNode(treeNode,!treeNode.checked,true);treeObj.checkNode(treeNode,treeNode.checked,false)}onCheck'+ randomNum +'()}var timeClick;function onNodeClick'+ randomNum +'(e,treeId,treeNode){clearTimeout(timeClick);timeClick=setTimeout(function(){var zTree=$.fn.zTree.getZTreeObj("tree1'+ randomNum +'");zTree.expandNode(treeNode);clearTimeout(timeClick)},230)};var zTree;var setting'+ randomNum +'={async:{enable:true,type:\"get\",url:getDataUrl,dataFilter:ajaxDataFilter},view:{dblClickExpand:false,showLine:true,selectedMulti:false,'+ (CRUD==0?('addHoverDom:addHoverDom,removeHoverDom:removeHoverDom'):"")+'},data:{simpleData:{enable:true,idKey:\"id\",pIdKey:\"pid\",rootPId:\"\"}},check:{enable:true,chkStyle:chkStyle,radioType:radioType,chkboxType:chkboxType},edit:{renameTitle:\"编辑节点名称\",'+(CRUD==0?('enable:true,showRenameBtn:true,showRemoveBtn:true'):"")+'},callback:{onClick:onNodeClick'+ randomNum +',beforeCheck:true,onCheck:onCheck'+ randomNum +',beforeRename:zTreeBeforeRename,onDblClick:onDblClick'+ randomNum +',}};$(document).ready(function(){$.fn.zTree.init($(\"#tree1'+ randomNum +'\"),setting'+ randomNum +')});function ajaxDataFilter(treeId,parentNode,responseData){if(responseData.code==\"success\"){var data=responseData.data}return data}function addHoverDom(treeId,treeNode){var sObj=$(\"#\"+treeNode.tId+\"_span\");if(treeNode.editNameFlag||$(\"#addBtn_\"+treeNode.tId).length>0){return}var addStr=\"<span class=\'button add\' id=\'addBtn_\"+treeNode.tId+\"\' title=\'添加子节点\' onfocus=\'this.blur();\'><\/span>\";sObj.after(addStr);var addBtn=$(\"#addBtn_\"+treeNode.tId);if(addBtn){addBtn.bind(\"click\",function(){var zTree=$.fn.zTree.getZTreeObj(\"tree1'+ randomNum +'\");$.ajax({url:addDataUrl,type:\"post\",dataType:\"json\",contentType:\"application\/json\",data:JSON.stringify({pid:treeNode.id,name:\"demo\"}),success:function(data){var newId=data.data.id;var newnade={id:newId,name:\"demo\"};zTree.addNodes(treeNode,newnade);zTree.updateNode(treeNode)},error:function(data){}});return false})}var delBtn=$(\"#\"+treeNode.tId+\"_remove\");if(delBtn){delBtn.bind(\"click\",function(){$.ajax({url:deleteDataUrl,type:\"post\",dataType:\"json\",contentType:\"application\/json\",data:JSON.stringify({id:treeNode.id}),success:function(data){},error:function(data){}})})}}function removeHoverDom(treeId,treeNode){$(\"#addBtn_\"+treeNode.tId).unbind().remove()}function zTreeBeforeRename(treeId,treeNode,newName,isCancel){$.ajax({url:updateDataUrl,type:\"put\",dataType:\"json\",contentType:\"application\/json\",data:JSON.stringify({id:treeNode.id,name:newName}),success:function(data){},error:function(data){}})};<\/script><\/div><\/div>'
                        formeditor=formeditor.replace(/<input\s[^>]+shushow="1".*?>/,bMyHtml);
                    }else {
                        formeditor = myArr01 + aMyHTML + myArr02;
                    }
                }
            }
            if (formeditor.indexOf('idtype="file"') != -1){
                formeditor+='<script>var myFile=document.querySelectorAll(\"[idtype=\'file\']\");for(var i=0;i<myFile.length;i++){myFile[i].onclick=function(){var thisID=\"$\"+this.id;var myHtml=\ "<p style=\'text-align: center\'>文件储存路径:<input id=\'fileTxt\' value=\'http://192.168.2.31:8443/spring-boot/upload/file\' /></p><p style=\'text-align: center\'><input type=\'file\' accept=\'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\' multiple=\'multiple\' id=\"+thisID+\" /></p>\";modalBoxBody.innerHTML=myHtml;confirm.setAttribute(\"id\",\"fileOK\");fileOkFn(thisID);modalBoxFather.style.display=\"block\"}}function fileOkFn(thisID){var thisID=document.getElementById(thisID);var fileOK=document.getElementById(\"fileOK\");var fileTxt=document.getElementById(\"fileTxt\").value;var formData=new FormData();thisID.onchange=function(){var file=thisID.files;var fileType;for(var i=0;i<file.length;i++){fileType=file[i].type;if(fileType==\"image/png\"||fileType==\"image/gif\"||fileType==\"image/jpeg\"||fileType==\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\"){if(fileType==\"image/png\"||fileType==\"image/gif\"||fileType==\"image/jpeg\"){var reader=new FileReader();reader.onload=function(e){var el=document.createElement(\"img\");el.setAttribute(\"src\",e.target.result);el.setAttribute(\"style\",\"width: 33%\");modalBoxBody.appendChild(el)};reader.readAsDataURL(file[i])}}else{return alert(\"上传只支持 .xlsx的Excel文件\")}formData.append(\"file\",file[i])}};fileOK.onclick=function(){var xhr=new XMLHttpRequest();xhr.open(\"POST\",fileTxt,true);xhr.onreadystatechange=function(){var XMLHttpReq=xhr;if(XMLHttpReq.readyState==4){if(XMLHttpReq.status==200){alert(\"上传成功...\");modalBoxFather.style.display=\"none\";modalBoxBody.innerHTML=\"\"}else{if(XMLHttpReq.status==404){return alert(\"服务器异常或者URL路径错误，报错404,储存失败...\")}else{return alert(\"储存失败...\")}}}};xhr.send(formData)}};<\/script>'
            }
            if (formeditor.indexOf('idtype="total"') != -1){
                formeditor+='<script>var total=document.querySelectorAll(\"[idtype=\'total\']\");for (var i =0;i<total.length;i++){total[i].onclick=function(){confirm.id=\"totalOK\";modalBoxFather.style.display=\"block\";var myHtml=\'<p style=\"text-align: center\">第几行(多行请用\",\"英文逗号隔开):</p>\'+\'<p style=\"text-align: center\"><input type=\"text\" id=\"totalH\"/></p>\'+\'<p style=\"text-align: center\">第几列(请输入多个用\",\"英文逗号隔开):</p>\'+\'<p style=\"text-align: center\"><input type=\"text\" id=\"totalL\"/></p>\';modalBoxBody.innerHTML=myHtml;totalFn()}}function totalFn(){var totalOK=document.getElementById(\"totalOK\");totalOK.onclick=function(){var num=0;var totalH=document.getElementById(\"totalH\").value.split(/,|，/g);var totalL=document.getElementById(\"totalL\").value.split(/,|，/g);if(totalH==\"\"||totalL==\"\"){return false}var myTable=document.querySelector(\"table\");var myTr=myTable.children[0].children;for(var i=0;i<totalH.length;i++){var ttr=myTr[totalH[i]-1];if(ttr==undefined||totalL.length==1){return alert(\"请输入正确的行数或列数\")}for(var j=0;j<totalL.length;j++){num+=parseInt(ttr.children[totalL[j]-1].innerHTML)||0}var el=document.createElement(\"td\");el.innerHTML=num;ttr.replaceChild(el,ttr.lastChild);num=0}modalBoxFather.style.display=\"none\";modalBoxBody.innerHTML=\"\";confirm.setAttribute(\"id\",\"\")}};</script>'
            }
            if (formeditor.indexOf('idtype="paging')!=-1){
                var randomNum =parseInt(Math.random()*1000);
                var pagingConfig = '{'+
                    'url: "./data/paging.json",'+//必填Ajax 地址
                    'id: "pagingFn",'+//必填
                    'pagingHome: "pagingHome",'+//必填
                    'pagingLast: "pagingLast",'+//必填
                    'pagingGo: "pagingGo",'+//必填
                    'pageSize: 10,'+//选填
                    'showPaging: 5'+//选填 显示多少按钮
                '}';
                //此处要写分页功能代码
                var myStr09 = '<style>#paging'+ randomNum +'{text-align:center;margin: 10px 0 20px;}#paging'+ randomNum +'>ul,#paging'+ randomNum +'>ul>li,#paging'+ randomNum +'>div{display:inline-block;margin:0;padding:0;list-style:none;vertical-align:middle}#paging'+ randomNum +'>ul>li{float:left;color:#08c;padding:4px 10px;border:1px solid #ddd;cursor:pointer}#paging'+ randomNum +'>ul>li:hover,#paging'+ randomNum +' a:hover{color:#005580;background-color:#f5f5f5}#paging'+ randomNum +'>ul>li:first-child{border-radius:4px 0 0 4px}#paging'+ randomNum +'>ul>li:last-child{border-radius:0 4px 4px 0}#paging'+ randomNum +' a{display:inline-block;font-size:14px;line-height:20px;text-decoration:none;padding:4px 10px;border:1px solid #ddd;border-radius:4px;vertical-align:middle}.pagingavtive{background-color:#f5f5f5;color:#999!important;cursor:default!important}#paging'+ randomNum +'>div{vertical-align:top}#paging'+ randomNum +' input{margin:0;width:20px;vertical-align:top}#paging'+ randomNum +'>div>input{border-radius:4px 0 0 4px}#paging'+ randomNum +'>div>a{border-radius:0 4px 4px 0}</style>'+
                    '<div id="paging'+ randomNum +'"><a href="javascript:;" id="pagingHome">«</a><ul id="pagingFn"></ul><a href="javascript:;" id="pagingLast">»</a><div><input type="text"><a href="javascript:;" id="pagingGo">GO</a></div></div>'+
                    '<script>pagingFnNav('+ pagingConfig +');function pagingFnNav(obj){var url=obj.url;var pagingNum,ispaging,showPaging=obj.showPaging||5;var pagingFn=document.getElementById(obj.id);var pagingHome=document.getElementById(obj.pagingHome);var pagingLast=document.getElementById(obj.pagingLast);var pagingGo=document.getElementById(obj.pagingGo);pagingHome.onclick=function(){fn(this.getAttribute("data-pagingnum"))};pagingLast.onclick=function(){fn(this.getAttribute("data-pagingnum"))};pagingGo.onclick=function(){var numV=this.previousElementSibling.value;this.previousElementSibling.value="";fn(numV)};pagingFn.onclick=function(ev){var ev=ev||window.event;var target=ev.target||ev.srcElement;if(target.nodeName.toLowerCase()=="li"){console.log(target.getAttribute("data-pagingnum"));if(target.getAttribute("class")=="pagingavtive"){return false}fn(target.getAttribute("data-pagingnum"))}};fn();function fn(pageNum){pagingFnAjax(url+"?pageNum="+(pageNum||1)+"&pageSize="+(obj.pageSize||10),function(data){pagingFn.innerHTML="";var num=0;pagingNum=data.paging;ispaging=data.ispaging;pagingHome.setAttribute("data-pagingnum",1);pagingLast.setAttribute("data-pagingnum",pagingNum);var intN=Math.floor(showPaging/2)+1;var remainPageNum=pagingNum-ispaging;var navPageNum=showPaging-intN;if(ispaging>intN&&remainPageNum>=navPageNum){num=ispaging-intN}else{if(remainPageNum<navPageNum){num=pagingNum-showPaging;if(remainPageNum<=0){pagingLast.setAttribute("class","disabled")}}}for(var i=num;i<showPaging+num;i++){var elL=document.createElement("li");elL.setAttribute("data-pagingnum",i+1);elL.innerHTML=i+1;if(ispaging==i+1){elL.setAttribute("class","pagingavtive")}pagingFn.appendChild(elL)}})}function pagingFnAjax(url,callback){var xhr=new XMLHttpRequest();xhr.open("get",url);xhr.onreadystatechange=function(){var XMLHttpReq=xhr;if(XMLHttpReq.readyState==4){if(XMLHttpReq.status==200){var data=XMLHttpReq.response;data=JSON.parse(data);callback(data)}else{if(XMLHttpReq.status==404){alert("404")}}}};xhr.send()}};</script>'
                formeditor=formeditor.replace(/<input\s[^>]+idtype="paging".*?>/g,myStr09);
            }
            if (formeditor.indexOf('idtype="table"')!=-1){
                var tableId,tableW,tableH;
                for(var ii = 1 ; ii < myDate.length;ii++){
                    var iiObj = myDate[ii];
                    for (var key in iiObj){
                        if(iiObj.idtype=="table"){
                            // console.log(iiObj);
                            tableId = iiObj.id;
                            tableW = iiObj.tablewidth;
                            tableH = iiObj.tableheight;
                            break;
                        }
                    }
                }
                if(tableW.indexOf("%") == -1){
                    tableW = tableW + "px";
                }

                // debugger;
                var myStr10 = '<div style=\"width:' + tableW + '\"><table id='+tableId+' data-toggle="table" data-show-columns="true" data-show-fullscreen="true" data-search="true" data-show-refresh="true"        data-show-toggle="true" data-striped="true" data-sort-name="id" data-toolbar="#toolbar" data-query-params="queryParams"        data-query-params-type="limit" onDblClickRow="onDblClickRow" data-pagination="true" data-page-number="1" data-page-size="10"        data-side-pagination="server" data-pagination="true" data-page-list="[10,20,50,100]" data-pagination-first-text="首页"        data-pagination-pre-text="上一页" data-pagination-next-text="下一页" data-pagination-last-text="末页" data-query-params="queryParams"        data-method="get" data-response-handler="responseHandler" data-row-style="rowStyle" data-url="http://192.168.2.31:8444/spring-boot/book/pageList"        style="text-overflow: ellipsis;white-space: nowrap;"><thead><tr><th data-field="id">id</th><th data-field="reader">reader</th><th data-field="isbn">isbn</th><th data-field="title">title</th><th data-field="author">author</th><th data-field="description">description</th></tr></thead></table></div>'+
                        '<script>function queryParams(params){return{pageSize:params.limit,pageNum:params.offset/params.limit+1,}}function responseHandler(result){var errcode=result.code;if(errcode!="success"){alert("错误代码"+errcode);return}return{"total":result.data.total,"rows":result.data.list}}function refresh(){$("#table").bootstrapTable("refresh",{url:"http://192.168.2.31:8444/spring-boot/book/pageList"})};<\/script>';

                formeditor=formeditor.replace(/<input\s[^>]+idtype="table".*?>/g,myStr10);
            }
            formeditor='<style>#modalBoxFather{ display: none; position: fixed; top: 0; width: 100%; height: 100%;margin-left: -10px;background-color: rgba(0,0,0,.5);  z-index: 9999;}#modalBox{position: absolute;top: 100px;left: 50%;width:80%;max-width:600px;min-width:300px;-webkit-border-radius: 10px;-moz-border-radius: 10px;border-radius: 10px;background: #fff;border: 1px solid #ebeef5;transform: translateX(-50%);box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);padding: 0 0 50px;box-sizing: border-box;z-index: 999}#modalBoxMove{margin:0;cursor:move;height:32px}#X{position: absolute;top: 5px;right: 10px;width: 20px;text-align: center;cursor:pointer;}#modalBoxBody{padding-top:10px;width:100%;min-height:200px;border-top:1px solid #ebeef5;}.confirm{position:absolute;bottom:15px;right:25%;}#cancel{position: absolute;bottom:15px;right:10%;}</style><div id="modalBoxFather"><div id="modalBox"><p id="modalBoxMove"></p><span id="X" onselectstart="return false;">X</span><div id="modalBoxBody"></div><input type="button" id="" class="confirm" value="确定"><input type="button" id="cancel" value="取消"></div></div>'+formeditor
        }
        return {formeditor:formeditor,myDate:myDate}
    }
};