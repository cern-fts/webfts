<div class="navbar-left">
	<?php
		if (!isset($_SERVER['SSL_CLIENT_M_SERIAL'])
		|| !isset($_SERVER['SSL_CLIENT_V_END'])
		|| !isset($_SERVER['SSL_CLIENT_VERIFY'])
		|| $_SERVER['SSL_CLIENT_VERIFY'] !== 'SUCCESS'
		|| !isset($_SERVER['SSL_CLIENT_I_DN'])) {
			echo "<div id='auth'><span>You are not providing a valid user certificate</span></div>";
		} elseif ($_SERVER['SSL_CLIENT_S_DN_CN_2']) {
			echo "<div id='auth'><span>You are authenticated as <strong>{$_SERVER['SSL_CLIENT_S_DN_CN_2']}</strong></span></div>";
		} elseif ($_SERVER['SSL_CLIENT_S_DN_CN']) {
			echo "<div id ='auth'><span>You are authenticated as <strong>{$_SERVER['SSL_CLIENT_S_DN_CN']}</strong></span></div>";
		}
	?>
</div>
