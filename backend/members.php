<?php
require_once 'config.php';
require_once 'sql.php';

$db = Sql::app();

$num = !empty($_GET['num']) ? (int) $_GET['num'] : 10;//number per page
$page = !empty($_GET['page']) ? (int) $_GET['page'] : 1;//page number
//select order
if ($_GET['order'] == 'undefined') $order = 'id';
else $order = $_GET['order'];
//select desc
if ($_GET['desc'] == 'false') $desc = 'ASC';
else $desc = 'DESC';

//Фильтрация
$query = !empty($_GET['query']) ? $_GET['query'] : null;
$query = json_decode($query, true);
if ($query == []) $query = null;

if (!empty($query)) {
	$q = "WHERE ";
	foreach ($query as $k => $v) {
		$q .= $k ." LIKE '%". $v . "%' AND ";
	}
	$q = substr($q, 0, -5);
} else $q = 'q';


if (empty($query)) {
	$count = $db->selectOne("SELECT COUNT(id) AS total FROM member");	
}
else {
	$count = $db->selectOne("SELECT COUNT(id) AS total FROM member $q");		
}


$total = (int) $count['total'];

//Number of pages
$total_pages = (($total - 1) / $num) + 1;
$total_pages =  intval($total_pages);
$page = intval($page);

if(empty($page) or $page < 0) $page = 1;
if($page > $total_pages) $page = $total_pages;

$start = $page * $num - $num;



if (empty($query)) {
	$items = $db->selectAll("SELECT * FROM member ORDER BY $order $desc LIMIT  $start, $num");
}
else {
	$items = $db->selectAll("SELECT * FROM member $q ORDER BY $order $desc LIMIT  $start, $num");
}


$response = [];

if (!empty($items)) {	
	$response['status'] = 'ok';
	$response['error'] = 0;
	$response['page'] = $page;
	$response['query'] = $query;	

	$response['total_count'] = $total;
	$response['data'] = $items;		
}
else {
	$response['status'] = 'empty';
	$response['error'] = 1;	
}



echo json_encode($response, JSON_NUMERIC_CHECK);


?>
