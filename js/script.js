/**
 * TechDegree Project 3 -- Interactive Form
 * 
 * Guo Chen_08/28/2019
 * 
 * Please reject if not meeting Exceeds Expectation
 * requirements. Thank you!
 */

//hides "other job" input field until it
//is selected in the menu
animateOtherJob = () => {
    //hides the input field for other job
    //title, and shows it only when clicked
    //in the drop down menu
    $('#other-title').hide();
    $('#title').on('click', e =>{
        if (e.target.value === 'other') {
            $('#other-title').slideDown();
        } else {
            $('#other-title').slideUp();
        };
    });
}

//hides the color drop down menu until
//shirt design is selected
animateShirtColor = () => {
    //rephrases the color options for simplicity while
    //labeling each options with corresponding class
    rephraseOptions = () => {
        const punsRegex = /(.+) \(JS Puns shirt only\)/i;
        const heartRegex = /(.+) \(I ♥ JS shirt only\)/i;
        $colorOptions.each((index, element) => {
            if(punsRegex.test($(element).text())) {
                $(element).text($(element).text().replace(punsRegex, '$1'));
                $(element).addClass('punsColor');
            } else if(heartRegex.test($(element).text())) {
                $(element).text($(element).text().replace(heartRegex, '$1'));
                $(element).addClass('heartColor');
            }
        });
    }

    //reacts to the event of T-shirt design selection
    designSelectHandle = () => {
        //When a shirt design is selected, displays
        //available color options, while hiding those
        //unavailable
        $('#design').on('click', e =>{
            if(e.target.value !== 'Select Theme') {
                $('#colors-js-puns').slideDown();
                $noColorOpt.hide(); //hides 'select design' prompt
                if(e.target.value === 'js puns') {
                    $('.punsColor').show();
                    $('.heartColor').hide();
                    //sets default color
                    $('.punsColor').eq(0).prop('selected', true);
                } else if (e.target.value === 'heart js') {
                    $('.punsColor').hide();
                    $('.heartColor').show();
                    //sets deffault color
                    $('.heartColor').eq(0).prop('selected', true);
                } else {
                    $colorOptions.show();
                }
            } else {
                //if the user deselects valid t-shirt design option
                //hides color drop-down menu
                $noColorOpt.show().prop('selected', true);
                $colorOptions.hide();
                $('#colors-js-puns').slideUp();
            };
        });
    }
    
    //hides color drop down menu
    $('#colors-js-puns').hide();
    //hides existing color options, and adds a default 
    //disabled option to prompt the user to select a design
    const $colorOptions = $('#color option').hide();
    const $noColorOpt = $('<option selected disabled>Please Select a T-shirt theme</option>')
        .appendTo($('#color'));

    rephraseOptions();
    designSelectHandle();
}

//helps user calculate total cost and
//disables conflicting events
actSelectAssist = () => {
    const $actChecks = $('.activities input');
    //appends a header to display total price, with
    //the "total cost" span extracted
    $('.activities').append($("<h3'>Total = <span id='totalCost'>0</span></h3>"));
    const $costSpan = $('#totalCost');

    //changes total price and disables when user
    //selects/deselects an event
    $('.activities').on('change', e => {
        const clicked = e.target;
        const clickedTime = $(clicked).data('day-and-time');
        //extracts cost of the changed event
        const actCost = $(clicked).data('cost').replace(/^\$(\d+)$/, '$1'); 
        $actChecks.each((index, element) => {
            if ($(element).data('day-and-time') === clickedTime && element !== clicked) {
                if ($(clicked).prop('checked')) {
                    //if user selects an event, conditionally hides conflicting options
                    $(element).prop('disabled', true);
                    $(element).parent().css('text-decoration', 'line-through');
                }else{
                    //if deselects an event, enable conflicting options
                    $(element).prop('disabled', false);
                    $(element).parent().css('text-decoration', '');
                }
            }
        });
        //calculates total cost, "*1" is used to parse
        //strings to integer
        if($(clicked).prop('checked')) {
            $costSpan.text($costSpan.text()*1 + actCost*1);
        } else {
            $costSpan.text($costSpan.text()*1 - actCost*1);
        };
    });
}

//shows info about selected payment methods
//while hiding irrelevant payment info
paySelect = () => {
    const $bitcoin = $('#bitcoin');
    const $paypal = $('#paypal');
    const $credit = $('#credit-card');
    //default selects credit card
    $('#payment option').eq(1).prop('selected', true);
    //disables the prompt, so users cannot select it
    $('#payment option').eq(0).prop('disabled', true);
    $paypal.hide();
    $bitcoin.hide();
    //if alternative payment options selected,
    //displays corresponding instructions
    $('#payment').on('change', e => {
        const payOption = $(e.target).val();
        if (payOption === 'Credit Card') {
            $credit.slideDown();
            $paypal.slideUp();
            $bitcoin.slideUp();
        } else if (payOption === 'PayPal') {
            $credit.slideUp();
            $paypal.slideDown();
            $bitcoin.slideUp();
        } else if (payOption === 'Bitcoin') {
            $credit.slideUp();
            $paypal.slideUp();
            $bitcoin.slideDown();
        }
    });
}

//Prepare the page ready for form submission
//and provides criteria for validation
validateForm = () => {
    const $nameAlert = $('<span class="alert">Please enter your name</span>')
        .appendTo($('#name').prev());
    const $emailAlert = $('<span class="alert">Please enter a valid email (e.g. myemail@example.com)</span>')
        .appendTo($('#mail').prev());
    const $actAlert = $('<span class="alert">Please select at least one activity</span>')
        .appendTo($('.activities legend'));
    const $ccNumAlert = $('<span class="alert"></span>')
        .appendTo($('#cc-num').parent());
    const $zipAlert = $('<span class="alert">Enter a 5-digit zip code</span>')
        .appendTo($('#zip').parent());
    const $cvvAlert = $('<span class="alert">Enter a 3-digit CVV</span>')
        .appendTo($('#cvv').parent());

    //gives the element a red outline
    //used as an alert indicator
    redOutline = $element => {
        $element.css('outline', 'solid')
        .css('outline-color', 'red');
    }

    //clears every alert message on the page
    clearAlert = () => {
        $('.alert').hide();
        $('input').css('outline', 'none');
    }

    //verifies whether the user has provided
    //a name and a valid email
    validBasicInfo = () =>{
        const validName = $('#name').val() !== '';
        if (!validName) {
            redOutline($('#name'));
            $nameAlert.show();
        };
        const validEmail = /^[^@]+@[^@]+\.\w+$/.test($('#mail').val());
        if (!validEmail) {
            redOutline($('#mail'));
            $emailAlert.show();          
        };
        return (validName && validEmail);
    }
    
    //checks whether user has selected at least
    //one activity
    validAct = () => {
        let selected = false;
        const $actChecks = $('.activities input');
        $actChecks.each((index, element) => {
            if ($(element).prop('checked')) {
                selected = true;
            } 
        });
        if (!selected) {
            redOutline($actChecks)
            $actAlert.show();
        };
        return selected;
    }

    //checks whether the user has provided:
    //valid card number: 13-16 digits
    //zip code: 5 digits
    //CVV: 3 digits
    validCCInfo = () => {
        const validCardNum = /^\d{13,16}$/.test($('#cc-num').val());
        if (!validCardNum) {
            redOutline($('#cc-num'));
            $ccNumAlert.show();
            if ($('#cc-num').val() === '') {
                $ccNumAlert.text('Please enter your credit card number');
            } else if (/\D/.test($('#cc-num').val())) {
                $ccNumAlert.text('Your input should contain numbers only');
            } else {
                $ccNumAlert.text('Please enter a number that is between 13 and 16 digits long');
            };
        };

        const validZip = /^\d{5}$/.test($('#zip').val());
        if (!validZip) {
            redOutline($('#zip'));
            $zipAlert.show();
        };
        const validCvv = /^\d{3}$/.test($('#cvv').val());
        if (!validCvv) {
            redOutline($('#cvv'));
            $cvvAlert.show();
        };
        return (validCardNum && validZip && validCvv);
    }

    //checks whether user has provided all required
    //info, including credit card info if that's the
    //selected payment method
    validate = () => {
        const validBI = validBasicInfo();
        const validA = validAct();
        if ($('#payment').val() === 'Credit Card') {
            return validCCInfo() && validBI && validA;
        } else {
            return validBI && validA;
        }
    }

    //hides all alert messages
    $('.alert').hide();

    //determines whether the form can be
    //submitted and rejects invalid info
    $('form').on('submit', (e) => {
        //clears alert every time the user attempts to submit
        clearAlert();
        if (validate()) {
            alert(`Registration Submission Completed!
            Please wait for a few years while we process your information ;)`);
        } else {
            e.preventDefault();
            console.log('fail');
        };
    });
}

//displays error indication for zip & cvv input
//in real time.
//Though the function uses similar codes in validateForm(),
//the following cannot be placed in validateForm, since
//validation only takes place upon submission
liveZipCvvErr = () => {
    const $zip = $('#zip');
    $zip.on('input', e => {
        const validZip = /^\d{5}$/.test($zip.val());
        if (validZip) {
            $zip.css('outline', 'none');
            $zip.next().hide(); //hides the alert span created in validateForm()
        } else {
            $zip.css('outline', 'solid').css('outline-color', 'red');
            $zip.next().show(); //shows the alert span
        };
    });

    const $cvv = $('#cvv');
    $cvv.on('input', e => {
        const validCvv = /^\d{3}$/.test($cvv.val());
        if (validCvv) {
            $cvv.css('outline', 'none');
            $cvv.next().hide(); //hides the alert span created in validateForm()
        } else {
            $cvv.css('outline', 'solid').css('outline-color', 'red');
            $cvv.next().show(); //shows the alert span
        };
    });
}

//sets the initial focus on name input
$('#name').focus();

//configures and adds interactivity to
//the form and enables validation
animateOtherJob();
animateShirtColor();
actSelectAssist();
paySelect();
validateForm();
liveZipCvvErr();
