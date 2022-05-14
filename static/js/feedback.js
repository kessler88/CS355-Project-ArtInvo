/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
$(function feedback() {
  /**
   * Updates the DOM
   * @param {*} data XHR result
   */
  function updateFeedback(data) {
    const render = [];
    // Reset all status messages
    $(".feedback-status").empty();

    // All went well, use data from post request (REST endpoint)
    if (!data.errors && data.feedback) { 
      // The input was valid - reset the form
      $(".feedback-form").trigger("reset");
      // our REST endpoint will give us the full list of feedback back so can traverse.
      $.each(data.feedback, function createHtml(key, item) {
        render.push(`
          <div class="feedback-item item-list media-list">
            <div class="feedback-item media">
              <div class="feedback-info media-body">
                <div class="feedback-head">
                  <div class="feedback-title">${item.title}</div>
                  <small>by ${item.name}</small>
                </div>
                <div class="feedback-message">
                  ${item.message}
                </div>
              </div>
            </div>
          </div>
        `);
      });
      // Update feedback-items with what the REST API returned
      $(".feedback-items").html(render.join("\n"));
      // Output the success message
      $(".feedback-status").html(
        `<div class="alert alert-success">${data.successMessage}</div>`
      );
    } else {
      // There was an error
      // Create a list of errors
      $.each(data.errors, function createHtml(key, error) {
        render.push(`
          <li>${error.msg}</li>
        `);
      });
      // Set the status message
      $(".feedback-status").html(
        `<div class="alert alert-danger"><ul>${render.join("\n")}</ul></div>`
      );
    }
  }

  /**
   * Attaches to the form and sends the data to our REST endpoint
   * Attaches to HTML/CSS classes or id, and attaches there to submit event
   * when someone hit the submit with the element of this class or id this method will be called.
   */
  $(".feedback-form").submit(function submitFeedback(e) {
    // Prevent the default submit form event
    e.preventDefault();

    // XHR POST request
    $.post(
      "/feedback/api",
      // Gather all data from the form and create a JSON object from it
      {
        name: $("#feedback-form-name").val(),
        email: $("#feedback-form-email").val(),
        title: $("#feedback-form-title").val(),
        message: $("#feedback-form-message").val(),
      },
      // Callback to be called with the data
      // this callback function operate on the data that comes back from our "/feedback/api" post request
      updateFeedback
    );
  });
});
