<?php
/**
 * 暨南大学首页的本地代理
 * @author horsley <imhorsley@qq.com>
 * @version 2012.12.22.1353 传说中的世界末日翌日
 */
$remote = "http://www.jnu.edu.cn" . $_SERVER["REQUEST_URI"];
$local_patch = dirname(__FILE__) . $_SERVER["REQUEST_URI"] . '.patch.php';

if ($mime = mime_type($remote))	//mime类型的发送，否则浏览器可能出现warnning
	header("Content-Type: $mime");

if (file_exists($local_patch)) {	//单文件对应的patch
	include_once($local_patch);
	echo patch(file_get_contents($remote));
} else {
	echo file_get_contents($remote);
}


function mime_type($filename) {	//mimetype映射的简单实现
	$mime = array(
		'gif' => 'image/gif',
		'jpg' => 'image/jpeg',
		'js'  => 'application/javascript',
		'css' => 'text/css',
		'xsl' => 'text/xml',
		'xml' => 'text/xml',
	);

	$ext = explode('.', $filename);
	$ext = strtolower(array_pop($ext));

	if (isset( $mime[$ext])) {
		return $mime[$ext];
	} else {
		return false;
	}
}