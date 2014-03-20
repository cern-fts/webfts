			<div class="navbar-left">
				<?php
					foreach($_SERVER as $h=>$v)
					if ($h == "SSL_CLIENT_S_DN_CN_2")
						echo "<div><span>You are authenticated as <strong>$v</strong></span></div>";
				?>
			</div>