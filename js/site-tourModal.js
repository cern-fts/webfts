var myIntro = introJs(),
    steps = [{
        element: '#id1',
        intro: "<h3><strong>Step 1:</strong></h3><h4>You need a valid certificate to start transfer files.</h4>"
        ,position: "bottom"
    }, {    
        // element: '#id2',
        intro: "<h3><strong>Step 2:</strong></h3><h4>The very first step in order to use WebFTS is the credentials delegation! If you have a valid certificate in your browser please follow the instrustions here, inorder to export and copy&paste your RSA key! Afterwards, please select your Virtual Organisation and click on &quot;<strong>Delegate</strong>&quot; button to start*! </h4></br><h5>Now, please press the &quot;<strong>Close</strong>&quot; to close this pop up and then press &quot;<strong>Next</strong>&quot; to continue the site tour!</h5>"
        ,position: "left"
    }, {
        element: '#id3',
        intro: "<h3><strong>Step 3:</strong></h3><h4>And actually that's it! You can start submitting your jobs!<br/>Here you can choose the storage type of your desire*!<br/>In case you selected the <strong>Dropbox transfer</strong>, the very first step is to <strong>log-in</strong> with your account in order to use this service!<br/>On the other way, if you choose the <strong>&quot;Grid SE&quot;</strong> you have to define the endpoint for the transfer!</h4><h5>*During this tour you will not be asked to choose something.</h5>"
        ,position:"bottom"
    }, {
        element: '#id4',
        intro: "<h3><strong>Step 4:</strong></h3><h4>This textfield is going to be enabled only for &quot;<strong>Grid SE</strong>&quot; transfers! At first you have to place here your endpoint and then to press the &quot;load&quot; button in order to load the content of your folder!</h4>"
        ,position:"bottom"
    }, {
        element: '#id5',
        intro: "<h3><strong>Step 5:</strong></h3><h4>Here is the area where is going to be displayed your folder's content.</h4>"
        ,position: "bottom"
    }, {
        element: '#id6',
        intro: "<h3><strong>Step 6:</strong></h3><h4>In this area you can either choose the type of the SE in the same way as before!</h4>"
        ,position: "bottom"
    },{
        element: '#id7',
        intro:"<h3><strong>Selection buttons:</strong></h3><h4>By clicking one, you can select/unselect all your files.</h4>"
        ,position: "bottom"
    }, {
        element: '#id8',
        intro: "<h3><strong>Refresh button:</strong></h3><h4>Once you place a new endpoint you can see all the contents of the folder by clicking on this.</h4>"
        ,position: "bottom"
    }, {
        element: '#id9',
        intro:"<h3><strong>Filter button:</strong></h3><h4>Specify your file(s) search!<br/>Multiple options: <br/>name,<br/>date,<br/>size of file(s)<br/> or search for simple files by avoiding display the containing folders!</br></h4>"
        ,position: "bottom"
    }, {
        element: '#id10',
        intro: "<h3><strong>Step 10:</strong></h3><h4>In this area you have the option to enable/disable some of these additional options!</h4>"
        ,position: "bottom"
    }, {
        element: '#id11',
        intro:"<h3><strong>Step 11:</strong></h3><h4>These are the main buttons for the transfer! Choose your files and then click on one of these buttons accordingly in which direction is going to be the tranfer of your desire!</h4>"
        ,position: "bottom"
    }, {
        element: '#id12',
        intro:"<h3><strong>Congratulations!</strong></h3><h4>That's all! You have finished with success your file(s) submittion!<br/><strong>Let's see live all your submited jobs and their status! Click on the button below to continue!</strong></h4>"
        ,position: "bottom-middle-aligned"
    }];

myIntro.setOptions({
    steps: steps
});

myIntro.onbeforechange(function (targetElement) {
    $.each(steps, function (index, step) {
        if ($(targetElement).is(step.element)) {
            switch (index) {
                case 1: 
                    $('#delegationModal').modal('show');
                    break;
                case 2:
                    $('#delegationModal').modal('hide');
                    break;
            }
            return false;
        }
    });
});

// myIntro.start();