<?php 
    session_cache_limiter('public');
	$cache_limiter = session_cache_limiter();
	session_cache_expire(480);
	$cache_expire = session_cache_expire();
	    	
	ini_set("session.cookie_lifetime","28800");
	ini_set("session.gc_maxlifetime","28800");
	
	if(!isset($_SESSION)) {
		session_start(
			[
				'cookie_lifetime' => 28800,
				'gc_maxlifetime' => 28800,
			]
		);		
	} 
?>