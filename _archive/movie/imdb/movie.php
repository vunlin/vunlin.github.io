<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'library/meekrodb.2.3.class.php';
DB::$user = 'root';
DB::$password = 'c3603896';
DB::$dbName = 'great_links';

$act = isset($_GET['act']) ? $_GET['act'] : "none";
$imdb_id = isset($_GET['imdb_id']) ? $_GET['imdb_id'] : "none";
if($act != "none"){
	if($imdb_id != "none"){
		DB::update('imdb', array(
		   $act => 1
		), "imdb_id=%s", $imdb_id);
		$counter = DB::affectedRows();
		echo $counter;
	}
	else{
		echo "error: empty imdb id";
	}
	exit;
}

$movie_type = isset($_GET["type"]) ? $_GET["type"] : "new";

switch ($movie_type) {
    case "new":
        $movies = DB::query("SELECT * FROM imdb WHERE archived = 0 AND ignored = 0 AND postponed = 0");
        break;
    case "archive":
        $movies = DB::query("SELECT * FROM imdb WHERE archived = 1");
        break;
    case "ignore":
        $movies = DB::query("SELECT * FROM imdb WHERE ignored = 1");
        break;
    case "postpone":
    	$movies = DB::query("SELECT * FROM imdb WHERE postponed = 1");
        break;
}


$html_output = "";

foreach ($movies as $movie){
	$html_output .= '<div class="movie_info" imdb_id="' . $movie['imdb_id'] . '">';
	$html_output .= $movie['year'] . " | " . $movie['title'] . " | ";
	$html_output .= '<a href="#" act="archived">archive it</a>' . ' | ' . '<a href="#" act="ignored">ignore it</a>' . '<a href="#" act="postponed">postpone review</a><br/>';
	$html_output .= '<img width="96" src="' . $movie['image'] . '" /><br/>';
	$html_output .= $movie['summary'] . "<br/>";
	$html_output .= "<hr/></div>";
}

$html_output = '<div id="content">' . $html_output . '</div>';
?>

<html>
<head>
</head>
<body>
	<style>
		body {
			width:800px;
			margin: 10px auto;
		}
		nav{
			padding:20px 0px;
		}
		nav a{
			padding-right:15px;
		}
		.movie_info {
			width:760px;
			font-size:18px;
		}
		.movie_info a {
			padding: 10px;
		}
	</style>
	<nav>
		<a href="movie.php?type=new">New</a><a href="movie.php?type=archive">Archived</a><a href="movie.php?type=ignore">Ignored</a><a href="movie.php?type=postpone">Postponed</a>
	</nav>
	<?php echo $html_output; ?>
	<script src="library/jquery-3.3.1.min.js"></script>
	<script>
		$( document ).ready( function(){
			$(".movie_info a").each(function(){
				var imdb_id = $(this).parent().attr("imdb_id");
				var act = $(this).attr("act");
				$(this).click(function(event){
					var options = { act: act, imdb_id: imdb_id };
					var block = $(this).parent();
					var jqxhr = $.get( "movie.php", options, function(data) {
					    if(data == 1){
					    	// remove current block
					    	block.remove();
					    }
					    else{
					    	alert (data);
					    }
					})
					.fail(function() {
					    alert( "error occured" );
					})
					event.preventDefault();
				});
			})
		} )
	</script>
</body>
</html>