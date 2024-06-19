(function ($) {
	"use strict";

   // Set up API key, URL, and model
   var apiKey;
   var url;
   var model;
   var temperature;
   var maxTokens;
   var allTeams;

 /*******************************************************
 * /             Load Team Member                      * /
 ********************************************************/
   function loadConfig(callback) {
      $.getJSON("json/config.json", function(data) {
        apiKey = data.API_KEY;
        url = data.url;
        model = data.model;
        temperature = data.temperature;
        maxTokens = data.max_tokens;
        allTeams = data.all_teams;
      
        if (typeof callback === "function") {
          callback();
        }

      });
    }
    //loadconfig
   loadConfig(function() {
     
   });
   
   function displayAllTeams (){
   
         // get the row element id
         var $row = $("#load-teams");

         // loop through the teamMembers array and generate the HTML for each team member
         var teamHtml = $.map(allTeams, function(teamMember) {
           
         return '<div class="col-lg-3 col-md-6">' +
            '<div class="team__item">' +
               '<div class="team__thumb mb-3">' +
                  '<img src="' +teamMember.profile_url + '" alt="">' +
                  '<button class="chat-btn" href="">Chat now</button>' +
               '</div>' +
               '<div class="team__content">' +
               '<h3 class="team__title">' 
                   + teamMember.team_name +
               '</h3>' +
               '<span class="team__designation">' + teamMember.team_designation + '</span>' +
               '<span class="team__description d-none">' + teamMember.description + '</span>' +
               '<span class="team__gender d-none">' + teamMember.gender + '</span>' +
               '</div>' +
            '</div>' +
         '</div>';
         });

         // set the HTML of the row element to the generated team HTML
         $row.html(teamHtml);   
       
   }
   loadConfig(displayAllTeams);
   // Returns the current time in the format: hh:mm:ss AM/PM
   function getCurrentTime() {
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = now.getSeconds();
      var amPm = hours < 12 ? 'AM' : 'PM';
      
      // Convert to 12-hour format
      hours = hours % 12 || 12;
      
      // Add leading zeros to minutes and seconds if necessary
      minutes = addLeadingZero(minutes);
      seconds = addLeadingZero(seconds);
      
      // Construct the time string
      var timeString = hours + ':' + minutes + ':' + seconds + ' ' + amPm;
      
      return timeString;
   }
   
   // Adds a leading zero to a number if it is less than 10
   function addLeadingZero(number) {
      return number < 10 ? '0' + number : number;
   }

   
  /*******************************************************
 * /             Get Team Member Details               * /
 ********************************************************/
   $('#load-teams').on('click', '.team__item', function() {

      $(".team-area").hide();
      $(".hero-area").hide();
      $(".footer-area").hide();
      $('.chat-bg').removeClass('d-none');
      
      
      // get the image source ,name and designation
      var imageSrc = $(this).find('img').attr('src');
      var name = $(this).find('.team__title').text();
      var firstWord = name.trim().split(' ')[0];
      var designation = $(this).find('.team__designation').text();
      var description = $(this).find('.team__description').text();
      var gender = $(this).find('.team__gender').text();

       // Get the current date and time
       var currentDate = new Date().toLocaleDateString();
       var currentTime = getCurrentTime();

      // set the image source and name in the .top-chat element
      $('.chat-box-top-avata img').attr('src', imageSrc);
      $('.chat-list-avata-sm img').attr('src', imageSrc);
      $('.top-chat-title').text(name);
      $('.ai-chat-title').text(name);
      $('.top-chat-designation').text(designation);
      $('.top-chat-gender').text(gender);
      $('.team-description').text(description);
      $('.response-name').text(firstWord);
      $('.date-time').text(currentDate+", "+currentTime);

  });
  
 
  /*******************************************************
 * /              Get API response                      * /
 ********************************************************/
    // Get the chat window and scrollable container elements
    var chatWindow = $('.chat-list-wrap');
    var convertionContainer = $('.chatbot-convertion');

    // Function to scroll to the bottom of the chat window
    function scrollToBottom() {
      chatWindow.scrollTop(convertionContainer.height());
    }

    // Scroll to the bottom initially (optional)
    scrollToBottom();
  

   // Function to handle sending the message and generating a response
function sendMessage() {
  var message = $('#messageInput').val();
      
  var contentlanguage = $('#select-lang').val();
  var contentTone = $('#select-tone').val();
  var contentStyle = $('#select-style').val();

  if(apiKey == 'INSERT_YOUR_API_KEY'){
    $('#api-key-warning').removeClass('d-none');
  }else{
    if(message){
      $.ajax({
        url: url,
        type: 'POST',
        headers: {
          "Authorization": "Bearer "+ apiKey,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
           model : model,
           prompt: message +
           ".The message should be written in " +
           contentlanguage +
           " language. The message should be writting tone"+contentTone+".The message should be writting style"+contentStyle,
           temperature: temperature,
           max_tokens: maxTokens,
           top_p: 1,
           frequency_penalty: 0,
           presence_penalty: 0,
        }),
        beforeSend: function(){
           $('.loading').removeClass('d-none');
           $('#messageInput').removeAttr('placeholder');

           var title = 'You';
           // Get the current date and time
           var currentDate = new Date().toLocaleDateString();
           var currentTime = getCurrentTime();
           var messageText = $('#messageInput').val();
         
           // Construct the HTML code for the message using the variables
           var messageHtml = '<div class="list-box list-box-right">' +
           '<div class="chat-list-item d-flex align-items-start">' +
           '<div class="chat-list-content-wrap ai-chat-content">' +
           '<div class="chat-list-content">' +
           '<h5 class="chat-list-title">' + title + '</h5>' +
           '<p class="user-response">' + messageText + '</p>' +
           '</div>' +
           '<div class="chat-meta-box d-flex justify-content-between">' +
           '<div class="chat-meta">' +
           '<span>' +
           '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
           '<path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="#74757A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
           '<path d="M7 3.39999V6.99999L9.4 8.19999" stroke="#74757A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
           '</svg>' +
           '</span>' +
           '<span>' + currentDate + ',' + currentTime + '</span>' +
           '</div>' +
           '<div class="chat-meta-btn copy-text">' +
           '<a class="meta-btn">' +
           '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
           '<path d="M11.7 4.55002H5.85005C5.13208 4.55002 4.55005 5.13205 4.55005 5.85002V11.7C4.55005 12.418 5.13208 13 5.85005 13H11.7C12.418 13 13 12.418 13 11.7V5.85002C13 5.13205 12.418 4.55002 11.7 4.55002Z" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"/>' +
           '<path d="M2.95 9.45H2.3C1.95522 9.45 1.62456 9.31304 1.38076 9.06924C1.13696 8.82544 1 8.49478 1 8.15V2.3C1 1.95522 1.13696 1.62456 1.38076 1.38076C1.62456 1.13696 1.95522 1 2.3 1H8.15C8.49478 1 8.82544 1.13696 9.06924 1.380 76C9.31304 1.62456 9.45 1.95522 9.45 2.3V2.95" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"/>' +
           '</svg>' +
           'Copy text' +
           '</a>' +
           '</div>' +
           '</div>' +
           '<div class="chat-list-play-btn">' +
           '<button class="play-voice"><i class="feather-play"></i></button>' +
           '</div>' +
           '</div>' +
           '<div class="chat-list-avata-sm">' +
           '<img src="assets/img/avata/avata-user.png" alt="">' +
           '</div>' +
           '</div>' +
           '</div>';
         

           // Append the message HTML to the chat output
           $('.chatbot-convertion').append(messageHtml);
        // Automatically scroll to the bottom of the chat window
        var chatWindow = $('.chat-list-wrap');
        chatWindow.animate({ scrollTop: chatWindow.prop('scrollHeight') }, 300);
           $('#messageInput').val('');
        },
        success: function(response) {
           
           var messageResponse = response.choices[0].text;
           var name = $('.top-chat-title').text();
           var profileSrc = $('.chat-box-top-avata img').attr('src');
           $('.loading').addClass('d-none');
           $('#messageInput').attr('placeholder', 'Type your message here');
           $('#msg-warning').addClass('d-none');
           // Define the regular expression pattern to match the placeholder for name
           var namePattern = /\[.*name.*\]/gi;

           // Replace the placeholder for name with the actual name
           var messageResponse = messageResponse.replace(namePattern, name);
           // Get the current date and time
           var currentDate = new Date().toLocaleDateString();
           var currentTime = getCurrentTime();
           
           var messageHtml = '<div class="list-box">' +
           '<div class="chat-list-item d-flex align-items-start">' +
             '<div class="chat-list-avata-sm">' +
               '<img src="'+profileSrc+'" alt="">' +
             '</div>' +
             '<div class="chat-list-content-wrap ai-chat-content">' +
               '<div class="chat-list-content">' +
                 '<h5 class="chat-list-title">'+ name +'</h5>' +
                 '<p class="chatbot-response"></p>' +
               '</div>' +
               '<div class="chat-meta-box d-flex justify-content-between">' +
                 '<div class="chat-meta">' +
                   '<span>' +
                     '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                       '<path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="#74757A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
                       '<path d="M7 3.39999V6.99999L9.4 8.19999" stroke="#74757A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
                     '</svg>' +
                   '</span>' +
                   '<span>' + currentDate + ', ' + currentTime + '</span>' +
                 '</div>' +
                 '<div class="chat-meta-btn copy-text">' +
                   '<a class="meta-btn">' +
                     '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                       '<path d="M11.7 4.55002H5.85005C5.13208 4.55002 4.55005 5.13205 4.55005 5.85002V11.7C4.55005 12.418 5.13208 13 5.85005 13H11.7C12.418 13 13 12.418 13 11.7V5.85002C13 5.13205 12.418 4.55002 11.7 4.55002Z" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"/>' +
                       '<path d="M2.95 9.45H2.3C1.95522 9.45 1.62456 9.31304 1.38076 9.06924C1.13696 8.82544 1 8.49478 1 8.15V2.3C1 1.95522 1.13696 1.62456 1.38076 1.38076C1.62456 1.13696 1.95522 1 2.3 1H8.15C8.49478 1 8.82544 1.13696 9.06924 1.38076C9.31304 1.62456 9.45 1.95522 9.31304 9.45 2.3 2.95" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"/>' +
                       '</svg>' +
                       'Copy text' +
                     '</a>' +
                   '</div>' +
                 '</div>' +
                 '<div class="chat-list-play-btn">' +
                 '<button class="play-voice"><i class="feather-play"></i></button>' +
                 '</div>' +
               '</div>' +
             '</div>' +
           '</div>';


           // Append the message HTML to the chat output
            $('.chatbot-convertion').append(messageHtml);
            // Automatically scroll to the bottom of the chat window
          var chatWindow = $('.chat-list-wrap');
          // Delay the scroll to ensure the message is fully added to the DOM
          scrollToBottom();
           var speed = 30; // The speed of typing (in milliseconds)
           var i = 0;
           var $chatbotResponse = $('.chatbot-response');
           var $newResponse = $('<div class="new-response"></div>'); // Create a new div for the new response
           $chatbotResponse.append($newResponse); // Add the new div to the chatbot-response container
           var interval = setInterval(function() {
           if (i < messageResponse.length) {
              $newResponse.append(messageResponse.charAt(i));
              i++;
              // Delay the scroll to ensure the message is fully added to the DOM
              scrollToBottom();
           } else {
              clearInterval(interval);
              $newResponse.removeClass('new-response'); // Remove the class so that it's not treated as a new response next time
              $chatbotResponse.append('<br>'); // Append a line break to the end of the response
              // Delay the scroll to ensure the message is fully added to the DOM
              scrollToBottom();
           }
           }, speed);
          
         
        },
        error: function(error) {
          console.log(error);
        }
      });
    }else{
      $('#msg-warning').removeClass('d-none');
    }
  }
}

   // Bind the send button click event to the sendMessage function
$('#send-button').on('click', sendMessage);

// Bind the enter key press event to the sendMessage function
$('#messageInput').on('keypress', function (e) {
  if (e.which === 13) {
    sendMessage();
  }
});

   function scrollNav() {
    $('.hero-btn').click(function(){
      $(".active").removeClass("active");     
      $(this).addClass("active");
      
      $('html, body').stop().animate({
        scrollTop: $($(this).attr('href')).offset().top - 0
      }, 300);
      return false;
    });
  }
  scrollNav();

 /*******************************************************
 * /               Play Voice                         * /
 ********************************************************/
 $('.play-voice').on('click', '.feather-pause', function(e) {
  e.stopPropagation(); // Prevent click event from bubbling up to parent elements
  
  window.speechSynthesis.cancel();
  // Change button class back to "feather-play" for the clicked icon
  $(this).removeClass('feather-pause').addClass('feather-play');
});

  
$('.chat-list-play-btn').on('click', '.play-voice', function() {
 
  var speaking = false; // Flag to track if speech synthesis is currently in progress
  var utterance; // Variable to hold the SpeechSynthesisUtterance object
  var button = $(this); // Reference to the clicked button element
  var icon = button.find('i'); // Reference to the clicked button's icon
  
  function speakText(text) {
    
    var text = $('.team-description').text();
    var textChunks = splitTextIntoChunks(text, 200); // Split text into chunks of 200 characters
    var currentChunkIndex = 0; // Index to keep track of the current chunk being spoken
    utterance = new SpeechSynthesisUtterance();
    utterance.rate = 1.0;
    utterance.volume = 1.0;
    utterance.pitch = 1.0;

    var gender = $('.top-chat-gender').text();
    if (gender == 'female') {
      utterance.lang = 'en-UK';
      utterance.voiceURI = 'Google UK English Female';
    } else {
      utterance.lang = 'en-GB';
      utterance.voiceURI = 'Google UK English Male';
    }

    speakChunk(); // Start speaking the first chunk
     
    function speakChunk() {
      if (currentChunkIndex >= textChunks.length) {
        // All chunks have been spoken, reset the state
        speaking = false;
        icon.removeClass('feather-pause').addClass('feather-play');
        return;
      }
     
      utterance.text = textChunks[currentChunkIndex];
      speechSynthesis.speak(utterance);
      speaking = true;
      // Change button class to "feather-pause"
      icon.removeClass('feather-play').addClass('feather-pause');

      utterance.onend = function() {
        currentChunkIndex++;
        speakChunk(); // Speak the next chunk
      };
    }
  }
  
  function stopSpeaking() {
    if (speaking) {
      speechSynthesis.cancel();
      speaking = false;
      // Change button class back to "feather-play" when speech is manually stopped
      icon.removeClass('feather-pause').addClass('feather-play');
    }
  }
  

  var row = $(this).closest('.ai-chat-content');
  var text = row.find('p').text();

  if (!speaking) {
    speakText(text);
  } else {
    stopSpeaking();
  }
});

function splitTextIntoChunks(text, chunkSize) {
  var chunks = [];
  var index = 0;

  while (index < text.length) {
    chunks.push(text.substr(index, chunkSize));
    index += chunkSize;
  }

  return chunks;
}

  
  $('.chatbot-convertion').on('click','.feather-pause',function(e) {
    e.stopPropagation();
    window.speechSynthesis.cancel();
    // Change button class back to "feather-play" when speech ends
    $('.play-voice').find('i').removeClass('feather-pause').addClass('feather-play');
  });

  $('.chatbot-convertion').on('click', '.feather-play', function() {
   
    var speaking = false; // Flag to track if speech synthesis is currently in progress
    var utterance; // Variable to hold the SpeechSynthesisUtterance object
    var button = $(this).closest('.play-voice'); // Reference to the clicked button element
    var icon = button.find('i'); // Reference to the clicked button's icon
  
    function speakText(text) {
      
  
  
      console.log(text);
      var textChunks = splitTextIntoChunks(text, 200); // Split text into chunks of 200 characters
      var currentChunkIndex = 0; // Index to keep track of the current chunk being spoken
  
      utterance = new SpeechSynthesisUtterance();
      utterance.rate = 1.0;
      utterance.volume = 1.0;
      utterance.pitch = 1.0;
  
      var gender = $('.top-chat-gender').text();
      if (gender == 'female') {
        utterance.lang = 'en-UK';
        utterance.voiceURI = 'Google UK English Female';
      } else {
        utterance.lang = 'en-GB';
        utterance.voiceURI = 'Google UK English Male';
      }
  
      speakChunk(); // Start speaking the first chunk
  
      function speakChunk() {
        if (currentChunkIndex >= textChunks.length) {
          // All chunks have been spoken, reset the state
          speaking = false;
          icon.removeClass('feather-pause').addClass('feather-play');
          return;
        }
  
        utterance.text = textChunks[currentChunkIndex];
        speechSynthesis.speak(utterance);
        speaking = true;
  
        // Change button class to "feather-pause"
        icon.removeClass('feather-play').addClass('feather-pause');
  
        utterance.onend = function() {
          currentChunkIndex++;
          speakChunk(); // Speak the next chunk
        };
      }
    }
  
    function stopSpeaking() {
      if (speaking) {
        speechSynthesis.cancel();
        speaking = false;
        // Change button class back to "feather-play" when speech is manually stopped
        icon.removeClass('feather-pause').addClass('feather-play');
      }
    }
  
    var listItem = $(this).closest('.chat-list-item');
    var text = listItem.find('.chat-list-content p').text();
  
    if (!speaking) {
      speakText(text);
    } else {
      stopSpeaking();
    }
  });
  
  function splitTextIntoChunks(text, chunkSize) {
    var chunks = [];
    var index = 0;
  
    while (index < text.length) {
      chunks.push(text.substr(index, chunkSize));
      index += chunkSize;
    }
  
    return chunks;
  }
  
  

/*******************************************************
 * /            Chatbot Settings                      * /
 ********************************************************/
  //chatbot convertion condition
   $('#chatbot-chat-close').on('click',function(){

    location.reload();
   
  });

  $('#chatbot-chat-clear').on('click',function(){ 
    // Remove the last AI answer from the chat conversation
    $('.chatbot-convertion .ai-answer').last().remove();
  });

  $('#chatbot-chat-clear').on('click',function(){ 
      // Remove the last AI answer from the chat conversation
    $('.chatbot-convertion .ai-answer').last().remove(); 
   });

  $('#chatbot-chat-clear-all').on('click',function(){  
    // Remove the entire chat conversation
    $('.chatbot-convertion').remove();    
   });

/*******************************************************
 * /            download pdf                          * /
 ********************************************************/
$('#chatbot-chat-pdf').on('click', function() {

  // Create a new jsPDF instance
  var doc = new jsPDF();

  // Get the conversation container element
  var conversationContainer = $('.chatbot-convertion')[0];

  // Find all .chatbot-convertion .ai-chat elements
  var aiChatElements = conversationContainer.querySelectorAll('.chatbot-convertion .chat-list-content-wrap');

  // Store the original background and border styles
  var originalStyles = [];

  // Loop through each .chatbot-convertion .ai-chat element and remove the background and border
  aiChatElements.forEach(function(element) {
    originalStyles.push({
      element: element,
      background: element.style.background,
      filter: element.style.filter
    });
    element.style.background = 'transparent';
    element.style.filter = 'none';
  });

  // Remove the buttons within the conversation container
  var buttons = conversationContainer.querySelectorAll('.chatbot-convertion button');
  buttons.forEach(function(button) {
    button.remove();
  });
  
  
// Create a new style rule
var style = document.createElement('style');

// Set the CSS rule to target the ::after pseudo-element of .chat-list-content-wrap and set its background to transparent
style.textContent = '.chat-list-content-wrap::after { background: transparent; }';

// Append the new style rule to the document head
document.head.appendChild(style);


  // Find all .chat-list-box elements and remove the border
  var chatListBoxElements = conversationContainer.querySelectorAll('.chat-list-content-wrap');
  chatListBoxElements.forEach(function(element) {
    element.style.border = 'none';
    element.style.background = 'transparent';
  });

  // Use dom-to-image to capture the conversation container as an image
  domtoimage.toPng(conversationContainer)
    .then(function(dataUrl) {
      // Restore the background and border for .chatbot-convertion .ai-chat elements
      originalStyles.forEach(function(style) {
        style.element.style.background = style.background;
        style.element.style.border = style.border;
      });

       // Remove the added style rule
       document.head.removeChild(style);
      // Add the image to the PDF document
      doc.addImage(dataUrl, 'PNG', 15, 15, 180, 0);

      // Download the PDF
      doc.save('conversation.pdf');
    })
    .catch(function(error) {
      console.error('Error generating PDF:', error);
    });

});


/*******************************************************
 * /            Download Chat Text                    / * 
********************************************************/
$('#chatbot-chat-text').on('click', function() {
  var teamName = $('.top-chat-title').text();
 
  var chatTitles = $('.chatbot-convertion .user-response').map(function() {
    return $(this).text();
  }).get();
  
  var chatResponses = $('.chatbot-convertion .chatbot-response').map(function() {
    return $(this).text();
  }).get();

  function createAndDownloadTxtFile(filename, content) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);

    $(element).css('display', 'none');
    $('body').append(element);

    element.click();

    $(element).remove();
  }

  // Combine chat titles and responses with line breaks
  var fileContent = chatTitles.map(function(title, index) {
    var conversationEntry = "You: " + title;
    if (teamName && chatResponses[index]) {
      conversationEntry += "\n" + teamName + ": " + chatResponses[index];
    }
    return conversationEntry;
  }).join("\n");

  var fileName = "example.txt";
  createAndDownloadTxtFile(fileName, fileContent);
});

/*******************************************************
 * /                   Copy Text                       / * 
********************************************************/
$('.chatbot-convertion').on('click','.copy-text',function(){
 
    var listItem = $(this).closest('.chat-list-item');
    var text = listItem.find('.chat-list-content p').text();
    // Create a temporary input element
    var tempInput = $('<input>');

    // Set the input value to the text content
    tempInput.val(text);
  
    // Append the input element to the body
    $('body').append(tempInput);
  
    // Select the input content
    tempInput.select();
  
    // Copy the selected text to the clipboard
    document.execCommand('copy');
  
    // Remove the temporary input element
    tempInput.remove();
    // Change the SVG text to "Text copied"
    var svgElement = $(this).find('svg');
    svgElement.parent().text('Copied');
});

$('.list-box').on('click','.copy-text',function(){
 
  var listItem = $(this).closest('.chat-list-item');
  var text = listItem.find('.chat-list-content p').text();
  // Create a temporary input element
  var tempInput = $('<input>');

  // Set the input value to the text content
  tempInput.val(text);

  // Append the input element to the body
  $('body').append(tempInput);

  // Select the input content
  tempInput.select();

  // Copy the selected text to the clipboard
  document.execCommand('copy');

  // Remove the temporary input element
  tempInput.remove();
  // Change the SVG text to "Text copied"
  var svgElement = $(this).find('svg');
  svgElement.parent().text('Copied');
});

    ////////////////////////////////////////////////////
    // 09. Sidebar Js
    $(".tp-menu-bar").on("click", function () {
      $(".chat-sidebar-offcanvas").addClass("opened");
      $(".body-overlay").addClass("apply");
    });
    $(".close-btn").on("click", function () {
      $(".chat-sidebar-offcanvas").removeClass("opened");
      $(".body-overlay").removeClass("apply");
    });
    $(".body-overlay").on("click", function () {
      $(".chat-sidebar-offcanvas").removeClass("opened");
      $(".body-overlay").removeClass("apply");
    });




})(jQuery);