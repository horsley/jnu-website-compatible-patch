//定义本应用的根路径
//var APP_ROOT_URL = "http" + "://127.0.0.1/jnu";
//var APP_ROOT_URL = "http" + "://www.jnu.edu.cn";	//proxy override
var APP_ROOT_URL = "http://127.0.0.16"; //proxy override here ********************************************<<<<<<<
//var APP_ROOT_URL = "http" + "://202.116.20.26/jnu";
var NEWSLIST_URI = "/html/channel/"; 
var XSL_URI = "/xsl/"

/**
*分页的信息列表使用该方法
*在页面上显示列表的div的id必须是div_rss_news_list并且是唯一的
*/
function RSS2loadPage(page, xsl, xmlPrefixUrl) {
	var c = RSS2findObj("div_rss_news_list");
	var xmlUrl = APP_ROOT_URL + NEWSLIST_URI + xmlPrefixUrl + page + ".xml";
	var xslUrl = APP_ROOT_URL + XSL_URI + xsl;
	var html = RSS2assembleXMLUrl(xmlUrl, xslUrl);
	c.innerHTML = html;
}

/**
*不分页的信息列表使用该方法
*eleId: 显示该信息列表的div的id,该id必须是唯一的
*xsl: xml文件的样式文件名
*xmlPrefixUrl 列表内容的xml文件名，channel_nonpage_频道id_列表大小 
*/
function RSS2loadNonPageList(eleId, xsl, xmlPrefixUrl) {
	var c = RSS2findObj(eleId);
	var xmlUrl = APP_ROOT_URL + NEWSLIST_URI + xmlPrefixUrl + "_1.xml";
	var xslUrl = APP_ROOT_URL + XSL_URI + xsl;
	var html = RSS2assembleXMLUrl(xmlUrl, xslUrl);
	c.innerHTML = html;
}

function RSS2loadLinkChannelList(eleId, xsl, xmlPrefixUrl) {
	var c = RSS2findObj(eleId);
	var xmlUrl = APP_ROOT_URL + NEWSLIST_URI + xmlPrefixUrl + ".xml";
	var xslUrl = APP_ROOT_URL + XSL_URI + xsl;
	var html = RSS2assembleXMLUrl(xmlUrl, xslUrl);
	c.innerHTML = html;
}

function RSS2loadNews(eleId, xsl, doc) {
	var c = RSS2findObj(eleId);

	//处理请求链接的参数
    var params = RSS2getUrlParameters(doc.location.toString());
  
  //注意链接的参数设置：
  //  newsPath指定新闻详细内容的路径
  
	var newsPath = null;
	if(params){
		newsPath = (params.hasOwnProperty("newsPath") ? params["newsPath"] : null);
	}

	//新闻详细内容链接http://portal.jnu.edu.cn/publish/publish/XmlFile/<新闻路径newsPath>.xml
	//如果使用了繁体转换网关，一定要这样写："http" + "://..."，避免繁体转换程序解析这个链接
	var xml_url = APP_ROOT_URL + "/html/" + newsPath + ".xml";
	var xsl_url = APP_ROOT_URL  + XSL_URI + xsl;
	c.innerHTML = RSS2assembleXMLUrl(xml_url, xsl_url);
}

function RSS2assembleXMLUrl(xmlUrl, xslUrl){
	/*
		这里我使用xmlhttp
		https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest
		XMLHttpRequest is a JavaScript object that was designed by Microsoft and adopted by Mozilla, Apple, and Google. 
		It's now being standardized in the W3C. It provides an easy way to retrieve data at a URL. 
		Despite its name, XMLHttpRequest can be used to retrieve any type of data, not just XML, a
		nd it supports protocols other than HTTP (including file and ftp).
	*/

	//http://www.w3schools.com/xml/xml_to_html.asp
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
  		xmlhttp=new XMLHttpRequest();
  	} else {// code for IE6, IE5
  		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  	}

	xmlhttp.open("GET", xmlUrl ,false);
	xmlhttp.send();
	xmlDoc=xmlhttp.responseXML;

	var contentNode = xmlDoc.getElementsByTagName("content")[0];
	if (contentNode) {	//目测是对文章的资源连接的转换
		var newNodeValue = handle_publish_html(contentNode.childNodes[0].nodeValue);
		contentNode.childNodes[0].nodeValue = newNodeValue;
	}

	xmlhttp.open("GET", xslUrl ,false);
	xmlhttp.send();
	xslDoc=xmlhttp.responseXML;

	//http://stackoverflow.com/questions/12149410/object-doesnt-support-property-or-method-transformnode-in-internet-explorer-1
	if (typeof (XSLTProcessor) != "undefined") { // FF, Safari, Chrome etc
  		var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslDoc);
        
    	var result = xsltProcessor.transformToFragment(xmlDoc, document);
    	var xmls = new XMLSerializer();
    	return xmls.serializeToString(result);

  	} else { // Internet Explorer
  		xml_Doc=new ActiveXObject("Microsoft.XMLDOM");
  		xml_Doc.async=false;
  		xml_Doc.loadXML(xmlDoc.xml);

  		return xml_Doc.transformNode(xslDoc);
  	}



  //================================= old shit below ================================
  if (window.ActiveXObject){
    return RSS2assembleXMLUrl_IE(xmlUrl, xslUrl)
  }else if(document.implementation && document.implementation.createDocument){  
    return RSS2assembleXMLUrl_FF(xmlUrl, xslUrl)
  } else {
    return null;
  }
}

//http://www.w3school.com.cn/php/php_ajax_suggest.asp
function GetXmlHttpObject() {
	var xmlHttp=null;
	try { // Firefox, Opera 8.0+, Safari
	 	xmlHttp=new XMLHttpRequest();
	} catch (e) { // Internet Explorer
		try {
	  		xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
	  	} catch (e) {
	  		xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
	  	}
	}
	return xmlHttp;
}


//

/**
 * IE实现
 */
function RSS2assembleXMLUrl_IE(xmlUrl, xslUrl){
	try{
    var xml_doc = new ActiveXObject("Microsoft.XMLDOM");
    xml_doc.async = false;   
    xml_doc.load(xmlUrl);  
	var contentNode = xml_doc.getElementsByTagName("content")[0];
	if (contentNode) {
		var newNodeValue = handle_publish_html(contentNode.childNodes[0].nodeValue);
		contentNode.childNodes[0].nodeValue = newNodeValue;
	}
    
    var xsl_doc = new ActiveXObject("Microsoft.XMLDOM");
    xsl_doc.async=false;   
    xsl_doc.load(xslUrl); 
	
    var result = xml_doc.transformNode(xsl_doc);

	return result;
	} catch(e){
		return null;
	}
}



/**
 * Firefox/Opera实现
 */
function RSS2assembleXMLUrl_FF(xmlUrl, xslUrl){
	//================================= old shit below ================================

	try{
    var xmlDoc = document.implementation.createDocument("", "", null);
    //xmlDocasync = false;  //对比下两行，这里是少了一个点？  by horsley
    xmlDoc.async = false;	//还是不行，下一步load的时候exception
    xmlDoc.load(xmlUrl);        
    var xslDoc = document.implementation.createDocument("", "", null);
    xslDoc.async = false;  
    xslDoc.load(xslUrl); 
	
	/* 
		https://developer.mozilla.org/en-US/docs/DOM/document.load
		document.load() is a part of an old version of the W3C DOM Level 3 Load & Save module. 
		Can be used with document.async to indicate whether the request is synchronous or asynchronous (the default). 
		As of at least Gecko 1.9, this no longer supports cross-site loading of documents (Use XMLHttpRequest instead).
	*/

  	var contentNode = xmlDoc.getElementsByTagName("content")[0];
	if (contentNode) {
		var newNodeValue = handle_publish_html(contentNode.childNodes[0].nodeValue);
		contentNode.childNodes[0].nodeValue = newNodeValue;
	}

    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslDoc);
    var result = xsltProcessor.transformToDocument(xmlDoc);
    var xmls = new XMLSerializer();
    var result = xmls.serializeToString(result);
   
    return result;
	} catch(err){  //看看exception是什么  Object #<Document> has no method 'load'
		txt="There was an error on this page.\n\n";
  		txt+="Error description: " + err.message + "\n\n";
  		txt+="Click OK to continue.\n\n";
  		alert(txt);
	}
}


function RSS2getUrlParameters(url){

	if(!url)return null;
	 
	var params = null;
	var url_str = url;
	  
	// 去掉#号后面的字符
	var u = url_str.indexOf("#");
	if(u >=0){
		url_str = url_str.substring(0, u);
	}
	  
	// 只要问号后面的参数
	var q = url.indexOf("?");
	if(q >=0){
		url_str = url_str.substring(q + 1);
	    if(url_str && url_str != ""){
	    	var strs = url_str.split("&");
	        if(strs && strs.length > 0){
	        	params = new Array();
	            for(var i = 0; i < strs.length; i++){
	                var vps = strs[i].split("=");
	                if(vps.length == 0){
	                   // do nothing
	                } else if(vps.length == 1){
	                    params[vps[0]] = null;
	                } else {
						params[vps[0]] = unescape(vps[1]);
					}
				}
				
			}
		}
    }
	
    return params;
}

//用于在页面中查找某个对象（来自Dreamweaver）
function RSS2findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

/**
 * 用于对Publish应用的文章作一些处理
 * 如：解决把正文中图片的相对路径强制转换为http://portal.jnu.edu.cn绝对路径
 */
function handle_publish_html(content){
  //解决把正文中图片的相对路径强制转换为http://portal.jnu.edu.cn绝对路径
  //var PUBLISH_APP_CONTEXT_URL = "http" + "://portal.jnu.edu.cn/publish/";
  //var PUBLISH_APP_CONTEXT_URL = "http" + "://127.0.0.1:7001/publish/";
  var PUBLISH_APP_CONTEXT_URL = "http" + "://portal.jnu.edu.cn/publish/";
  content = content.replace(/=\/publish\/uploadFile/g, "=" + PUBLISH_APP_CONTEXT_URL + "uploadFile/");
  content = content.replace(/="\/publish\/uploadFile/g, "=\"" + PUBLISH_APP_CONTEXT_URL + "uploadFile/");
  content = content.replace(/=\/publish\/eWebEditor/g, "=" + PUBLISH_APP_CONTEXT_URL + "eWebEditor/");
  content = content.replace(/="\/publish\/eWebEditor/g, "=\"" + PUBLISH_APP_CONTEXT_URL + "eWebEditor/");
  return content;
}