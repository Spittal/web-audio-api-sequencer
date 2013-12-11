<?php
$json= file_get_contents('php://input');
$jsarr=json_decode($json,true);
$branch=$jsarr["ref"];

if($branch=='refs/heads/master'){
 exec("git reset --hard");
 exec("git pull origin master");
} 
