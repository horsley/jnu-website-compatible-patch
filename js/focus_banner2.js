var img_focus_banner = RSS2findObj("img_focus_banner");
var focus_banner_step = 5000;
var focus_banner_changing = false;

var focus_banner_nextAd = function(){
  if(focus_banner_changing)return;

  if(!img_focus_banner)return;

  var imgArray = img_focus_banner.imgArray;
	var titleArray = img_focus_banner.titleArray;
	var linkArray = img_focus_banner.linkArray;

  if(!imgArray || imgArray.length < 0)return;
  
  focus_banner_changing = true;
  if(!img_focus_banner.arrayIndex){
    img_focus_banner.arrayIndex = 0;
  } else if(img_focus_banner.arrayIndex >= imgArray.length){
    img_focus_banner.arrayIndex = 0;
  }
  var index = img_focus_banner.arrayIndex;
  
  if (document.all){
    img_focus_banner.filters.revealTrans.Transition=100;
    img_focus_banner.filters.revealTrans.apply();
    img_focus_banner.filters.revealTrans.play();
  }

  img_focus_banner.src = imgArray[index];
  img_focus_banner.link = linkArray[index];
  img_focus_banner.alt = titleArray[index];
  img_focus_banner.style.display = "block";
  img_focus_banner.arrayIndex++;
  focus_banner_changing = false;
}

function focus_banner_goUrl(){
  if(!img_focus_banner)return;
  var link = img_focus_banner.link;
  if(!link || link.length == "")return;
  
  window.open(link);
}


function initArray() {
	var imgArray = new Array();
	var titleArray = new Array();
	var linkArray = new Array();
    
	var itemCountObj = document.getElementById("itemCount");	//其实这里也有问题，因为加载顺序的问题，有时候动态内容还没加载，所以这里会取不到元素

	if (itemCountObj) {
		var itemCount = itemCountObj.value;
		if (itemCount > 0) {
		var img_src;
		var img_title;
		var img_link;
			for(var i = 1; i <= itemCount; i++) {
				imgArray[i-1] = document.getElementById("itemSrc" + i).value;
				titleArray[i-1] = document.getElementById("itemTitle" + i).value;
				linkArray[i-1] = document.getElementById("itemLink" + i).value;
				
				//if(img_src.replace(/(^\s*)|(\s*$)/g, "") != ""){
				//	imgArray[i-1] = {"src:" + img_src, "title:" + img_title, "link:" + img_link};
				//}
				
			}
		}
	}
	img_focus_banner = RSS2findObj("img_focus_banner");
	img_focus_banner.imgArray = imgArray;
	img_focus_banner.titleArray = titleArray;
	img_focus_banner.linkArray = linkArray;
}

initArray();
focus_banner_nextAd();
var img_focus_banner_var = setInterval(focus_banner_nextAd, focus_banner_step);