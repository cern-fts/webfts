			<div class="navbar-left">
				<?php
					if ($_SERVER['SSL_CLIENT_S_DN_CN_2']) {
						echo "<div><span>You are authenticated as <strong>{$_SERVER['SSL_CLIENT_S_DN_CN_2']}</strong></span></div>";
					} elseif ($_SERVER['SSL_CLIENT_S_DN_CN']) {
						echo "<div><span>You are authenticated as <strong>{$_SERVER['SSL_CLIENT_S_DN_CN']}</strong></span></div>";
					}
				?>
			</div>
