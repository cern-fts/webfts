<?php
class WebTest extends PHPUnit_Extensions_Selenium2TestCase
{
    protected function setUp()
    {
        $this->setBrowser('firefox');
        $this->setBrowserUrl('https://webfts-dev.cern.ch');
    }

    public function testTitle()
    {
        $this->url('https://webfts-dev.cern.ch');
        $this->assertEquals('WebFTS - Simplifying power',$this->title());
    }
}
?>
