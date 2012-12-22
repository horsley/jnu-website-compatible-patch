<?php
//首页顶部校友网广告居中对齐的patch
function patch($index) {
	$index = str_replace('align="center"', 'style="margin-left:auto;margin-right:auto"', $index);

	return $index;
}