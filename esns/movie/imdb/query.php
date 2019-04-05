<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'library/meekrodb.2.3.class.php';
DB::$user = 'root';
DB::$password = 'c3603896';
DB::$dbName = 'great_links';

include_once 'library/simple_html_dom.php';
$movie_item = 1;
for (;$movie_item<1000; $movie_item += 50){
	$webpage = 'https://www.imdb.com/search/title?title_type=feature,tv_movie,tv_series,tv_special,tv_miniseries,documentary,video_game,short,video,tv_short&release_date=2010-01-01,&user_rating=6.0,&num_votes=200,&start=' . $movie_item;

	$results = file_get_html($webpage)->find('div.lister-item');
	$insert_arr = array();
	foreach ($results as $result){
		$titleDom = $result->find('h3 a');
		$title = $titleDom[0]->innertext;
		$imdb_id_parts = explode('/', $titleDom[0]->href);
		$imdb_id = $imdb_id_parts[2];
		$img = $result->find('img');
		$img = $img[0]->loadlate;
		$year = $result->find('.lister-item-year');
		$year = $year[0]->innertext;
		$summary = $result->find('p.text-muted');
		$summary = $summary[1]->innertext;

		$insert_arr[] = array(
			'imdb_id' => $imdb_id, //primary key
			'title' => $title,
			'image' => $img,
			'year' => $year,
			'summary' => $summary
		);
	/*
		echo $title . " | " . $year . " | " . $imdb_id . "<br/>";
		echo $summary . "<br/>";
		echo '<img src="' . $img . '" />' . "<br/>";*/
	}

	DB::insertIgnore('imdb', $insert_arr);
	echo "item: " . $movie_item . "<br/>";
	sleep(2);
}