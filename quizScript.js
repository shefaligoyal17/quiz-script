window.GetQuizBanner = (id, targetSelector = '#my-custom-container') => {
    const fetchApi = async (id) => {
      try {
        const res = await fetch(`https://post-summary.yukta.one/api/quiz/${id}`);
        const data = await res.json();
        if (data?.quiz?.length > 0) {
          return data?.quiz[0];
        } else if (data?.detail) {
          return data.detail;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        return null;
      }
    };
  
    const PostUserResponse = async (quizId, userAnswer) => {
      try {
        if (!quizId || !userAnswer) {
          return null;
        }
        const res = await fetch(`https://post-summary.yukta.one/submit_quiz`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quiz_id: quizId, user_answer: userAnswer }),
        });
        const data = await res.json();
        if (data?.success) {
          return true
        } else {
          return false
        }
      } catch (error) {
        console.error('Error posting data:', error);
        return null;
      }
    }
  
    const RenderQuizBanner = async (bannerId, targetSelector) => {
      const quiz = await fetchApi(bannerId);
      let selectedOption;
      if (quiz) {
        // Create the banner container
        const div = document.createElement('div');
        div.classList.add('custom-data-box');
        div.style.border = '1px solid #ccc';
        div.style.padding = '20px';
        div.style.margin = '20px';
        div.style.backgroundColor = '#f4f4f4';
        div.id = `banner-${bannerId}`;
  
        //Question Title
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('quiz-title');
        titleDiv.textContent = quiz.question;
  
        // Button Container
        const optionContainer = document.createElement('div');
  
        // Quiz Options
        quiz.options.forEach((option, index) => {
          //Parent div
          const div = document.createElement('div');
          div.id = `option-${index}-${bannerId}`;
          div.value = option
          div.textContent = option        
          div.classList.add('quiz-option');
          //style
          div.style.backgroundColor = 'white';
          div.style.border = '1px solid #ccc';
          div.style.padding = '10px';
          div.style.margin = '10px';
  
          //to change selected options style
          div.addEventListener('click', (event) => {
            event.preventDefault();
            selectedOption = event.target.value;
            //chnage back color of other option
            const otherOptions = optionContainer.querySelectorAll('.quiz-option');
            otherOptions.forEach((otherOption) => {
              otherOption.style.backgroundColor = 'white';
            });
            div.style.backgroundColor = 'lightgray';
        });
  
          optionContainer.appendChild(div);
        })
  //submit button for selected option
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Check Answer';
        submitButton.addEventListener('click', async (event) => {
          event.preventDefault();
          // send selected option to server
          const status = await PostUserResponse(bannerId, selectedOption);
          if (status) {
            div.removeChild(submitButton)
  
            //change style of selected option to green if correct else red and green the correct one
            const correctOption = quiz.answer
            const selectedOptionElement = document.getElementById(`option-${quiz.options.indexOf(selectedOption)}-${bannerId}`);
  
            if (correctOption === selectedOption) {
              selectedOptionElement.style.backgroundColor = 'lightgreen';
            }
            else {
              selectedOptionElement.style.backgroundColor ='lightcoral';
              const correctOptionElement = document.getElementById(`option-${quiz.options.indexOf(correctOption)}-${bannerId}`);
              correctOptionElement.style.backgroundColor = 'lightgreen';
            }
            } else {
            alert('Failed to submit response. Please try again.');
          }
        });
  
        div.appendChild(titleDiv);
        div.appendChild(optionContainer);
        div.appendChild(submitButton)
  
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
          targetElement.appendChild(div);
        } else {
          console.error(`Target element "${targetSelector}" not found. Appending to body instead.`);
          document.body.appendChild(div);
        }
  
      } else {
        console.error('No summary or detail available.');
      }
    };
  
    RenderQuizBanner(id, targetSelector);
  };
  