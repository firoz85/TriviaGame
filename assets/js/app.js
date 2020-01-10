$(document).ready(function(){
    $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click' , '.option', trivia.guessChecker);
  
})

var correctAnswer = [];
var incorrectAnswer = [];
var trivia = {
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId : '',
  // Questions, Options and Answers data
  questions: {
    q1: 'The first Australian capital with a direct telegraphic link to London was?',
    q2: 'The Australian Crawl is?',
    q3: 'Coober Pedy is located in which state or territory?'
  },
  options: {
    q1: ['Sydney', 'Hobart', 'Adelaide', 'Perth'],
    q2: ['A snake', 'A subservient Greeting', 'A swimming Stroke', 'A tractor Race'],
    q3: ['New South Wales', 'Western Australia', 'Northern Territory', 'South Australia']
  },
  answers: {
    q1: 'Adelaide',
    q2: 'A swimming Stroke',
    q3: 'South Australia'
  },
  
  // method to initialize game
  startGame: function(){
    // Restarting game results
    currentAnswer = 0;
    correctAnswer = [];
    incorrectAnswer = [];
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    
    // show game section
    $('#game').show();
    
    //  empty last results
    $('#results').html('');
    
    // show timer
    $('#timer').text(trivia.timer);
    
    // Hide start button
    $('#start').hide();
    //Show Remaining time
    $('#remaining-time').show();
    
    // Dispaly question
    trivia.nextQuestion();
    
  },
  // method to loop through and display questions and options 
  nextQuestion : function(){
    
    // set timer to 10 seconds each question
    trivia.timer = 10;
     $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // to prevent timer speed up
    if(!trivia.timerOn){
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    
    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);
    
    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    // creates all the trivia guess options in the html
    $.each(questionOptions, function(index, key){
      $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
    })
    
  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        if(trivia.timer === 4){
          $('#timer').addClass('last-seconds');
        }
    }
    // the time has run out and increment unanswered, run result
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      // adds results of game (correct, incorrect, unanswered) to the page
      var correctQuestions = "";
      for (var j = 0; j < correctAnswer.length; j++) {
        correctQuestions += correctAnswer[j] + "<br>";
      }

      var incorrectQuestions = "";
      for (var i = 0; i < incorrectAnswer.length; i++) {
        incorrectQuestions += incorrectAnswer[i] + "<br>";
      }

      $('#results')
        .html('<h3>Results:</h3>'+
        '<p>You got <b>' + trivia.correct +' </b>question(s) right.</p>'+
        '<p>You got <b>' + trivia.incorrect +' </b>question(s) wrong.</p>'+
        '<p>Un-Aswered: <b>'+ trivia.unanswered +' </b>question(s)</p>'+
        '<p><b>You got these questions right:</b><br> '+ correctQuestions +'</p>'+
        '<p><b>You got these questions wrong:</b><br> '+ incorrectQuestions +'</p>'+
        '<p>Try again!</p>');
      
      // hide game sction
      $('#game').hide();
      
      // show start button to begin a new game
      $('#start').show();
    }
    
  },
  // method to evaluate the option clicked
  guessChecker : function() {
    
    // timer ID for gameResult setTimeout
    var resultId;
    
    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // if the text of the option picked matches the answer of the current question, increment correct
    if($(this).text() === currentAnswer){
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      correctAnswer.push(Object.values(trivia.questions)[trivia.currentSet]);
      clearInterval(trivia.timerId);      
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Correct Answer!</h3>');
    }
    // else the user picked the wrong option, increment incorrect
    else{
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');
      
      trivia.incorrect++;
      incorrectAnswer.push(Object.values(trivia.questions)[trivia.currentSet]);
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Better luck next time! '+ currentAnswer +'</h3>');
    }
    
  },
  // method to remove previous question results and options
  guessResult : function(){
    
    // increment to next question set
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // begin next question
    trivia.nextQuestion();
     
  }

}