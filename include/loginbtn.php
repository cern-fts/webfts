<?php
$config = include('../config.php');
?>

<div class="navbar-left btn-group">
    <form method="post" action="/login.php">
        <button class="btn btn-primary dropdown-toggle pull-right padding-class-2"
                type="button" data-toggle="dropdown">
            Login
            <span class="caret"></span>
        </button>

        <input id="provider" type="hidden" name="provider" onchange="this.form.submit();">
        <ul class="dropdown-menu" role="menu">
            <li role="presentation" class="dropdown-header">Select your IdP</li>

            <?php
            foreach ($config['oidc_provider'] as $idx => $op) {
                printf(<<<HTML
                <li>
                  <a style="cursor: pointer"
                     onclick="$('input#provider').val(%u).each(function() {
                       this.form.submit();
                     })">
                    %s
                  </a>
                </li>
HTML
                     , $idx, $op['description']);
            }
            ?>
        </ul>
    </form>
</div>
