var myIntro = introJs(),
    steps = [{
        element: '#idjobsTable',
        intro: "<h3><strong>Congratulations!</strong></h3></br><h4>In this area are going to be displayed all your submitted jobs! Check the live status of your submittions whenever you want!</br><strong>Are you ready to start?</strong></h4>"
        ,position: "bottom-middle-aligned"
    }];

myIntro.setOption("showStepNumbers", "false");
myIntro.setOptions({
    steps: steps
});

// myIntro.start();