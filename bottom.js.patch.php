<?php
//首页底部居中对齐的patch
function patch($index) {
	$index = str_replace("align='center'", 'style=\"margin-left:auto;margin-right:auto;text-align:center\"', $index);

	return $index;
}