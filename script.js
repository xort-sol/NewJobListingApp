$(document).ready(function() {
  let nextJobId = 10;
    function load_job_listings(data){
        $.each(data, function(index, job) {
          var jobListing = $("<div class='job-listing'></div>");
  
          var jobListingCol1 = $("<div class='col1'></div>");
          var jobListingCol2 = $("<div class='col2'></div>");
          var jobListingCol3 = $("<div class='col3'></div>");
          var jobLogo = $("<img class='job-listing__logo' src='" + job.logo + "'>");
          jobListingCol1.append(jobLogo);
          var jobListingCol2Row1 = $("<div class='col2row1'></div>");
          var jobCompany = $("<p class='job-listing__company'>").text(job.company);
          jobListingCol2Row1.append(jobCompany);
          if (job.new) {
              var jobNew = $("<span class='job-listing__new'>New!</span>");
              jobListingCol2Row1.append(jobNew);
            }
  
          if (job.featured) {
              var jobFeatured = $("<span class='job-listing__featured'>Featured</span>");
              jobListingCol2Row1.append(jobFeatured);
            }
          
          jobListingCol2.append(jobListingCol2Row1)
          
          var jobListingCol2Row2 = $("<div class='col2row2'></div>");
          var jobTitle = $("<h3>").text(job.position);
          jobListingCol2Row2.append(jobTitle);
          var jobListingCol2Row3 = $("<div class='col2row3'></div>");
          var jobLocation = $("<p class='job-listing__location'>").text(job.location);  
          var jobpostedAt = $("<p class='job-listing__postedAt'>").text(job.postedAt);
          var jobcontract = $("<p class='job-listing__jobcontract'>").text(job.contract);
          jobListingCol2Row3.append(jobpostedAt);
          jobListingCol2Row3.append(jobcontract);
          jobListingCol2Row3.append(jobLocation);
          var jobRole = $("<p class='job-listing__role'>").text(job.role);
          var jobLevel = $("<p class='job-listing__level'>").text(job.level);
          var languagesList = $("<ul class='job-listing__languages'>");
          var languages = job.languages;

          $.each(languages, function(index, language) {
          var languageItem = $("<li>").text(language);
          languagesList.append(languageItem);
          });
  
          jobListingCol3.append(jobRole);
          jobListingCol3.append(jobLevel);
          jobListingCol3.append(languagesList);
          var deleteicon = $("<i class='fa fa-trash'></i>")
          jobListingCol3.append(deleteicon);

          jobListing.attr('data-job-id', job.id);

          deleteicon.click(function() {
              var jobId = jobListing.attr('data-job-id');
              $('[data-job-id="' + jobId + '"]').remove();
          });

  
          jobListingCol2.append(jobListingCol2Row2);
          jobListingCol2.append(jobListingCol2Row3);
  
  
  
          jobListing.append(jobListingCol1);
          jobListing.append(jobListingCol2);
          jobListing.append(jobListingCol3);

          jobListing.click(function(){
            var popup = $("<div class='popup'>");
            popup.append("<h2>" + job.company + "</h2>");
            popup.append("<img src='"+job.logo+"'"+"</img>");
            popup.append("<p>" + job.position + "</p>");
            popup.append("<p>" + job.role + "</p>");
            popup.append("<p>" + job.level + "</p>");
            popup.append("<p>" + job.postedAt + "</p>");
            popup.append("<p>" + job.contract + "</p>");
            popup.append("<p>" + job.location + "</p>");
            popup.append("<p>Languages: " + job.languages.join(", ") + "</p>");
            popup.append("<p>Tools: " + job.tools.join(", ") + "</p>");

            var closeButton = $("<button>Close</button>");
            closeButton.click(function() {
              popup.remove();
            });
            popup.append(closeButton);

            $("body").append(popup);
          });


          $("#job-listings").append(jobListing);

        });  
    } 
    $.getJSON("./data.json", load_job_listings);
    const tagContainer = $('#tag-container');     

      function addTag(tag) {
        const tagElement = $('<div class="tag"></div>');
        const tagText = $('<span class="tag-text"></span>').text(tag);
        const tagRemove = $('<span class="tag-remove">&#10006;</span>');

        tagRemove.click(function() {
          tagElement.remove(); 
          filterItems();
        });
        tagElement.append(tagText, tagRemove);
        tagContainer.append(tagElement);
        $('#tag-input').val(''); 
        filterItems(); 
      }

      

      // Event handler for the tag input
      $('#tag-input').keydown(function(event) {
        if (event.key === 'Enter') {
          const tag = $(this).val().trim();
          if (tag !== '') {
            addTag(tag);
          }
        }
      });


      const seletctedTags = [];
      function filterItems() {
          $('.tag').each(function(){
            var index = seletctedTags.indexOf($(this).text());
            if(index === -1)
            {
                // var text = $(this).text();
                // var words = text.split('');
                // if (words.length > 1) {
                //   words.pop(); // Remove the last word
                //   $(this).text(words.join(''));
                // }
                seletctedTags.push($(this).text());
            }
          });
          console.log(seletctedTags)
          $('.job-listing').each(function() {
            var col3 = $(this).find('.col3');
            // console.log("rinnigng in job listing func");
            
            var roleElement = col3.find('.job-listing__role');
            var levelElement = col3.find('.job-listing__level');
            var languagesElement = col3.find('.job-listing__languages');
            
            var matches = seletctedTags.filter(function(tag) {
                // console.log("runnifn in filterr");
                var tagWithoutLastCharacter = tag.substring(0, tag.length - 1);
              return (
                roleElement.text().toLowerCase().includes(tagWithoutLastCharacter.toLowerCase()) ||
                levelElement.text().toLowerCase().includes(tagWithoutLastCharacter.toLowerCase()) ||
                languagesElement.text().toLowerCase().includes(tagWithoutLastCharacter.toLowerCase())
              );
            });
        
            if (matches.length > 0) {
              $(this).show();
            } else {
              $(this).hide();
            }
          });
      }

      $('#showAddNewJobBtn').click(function () {
        $('.modal-content').load('./addform.html');
        $('#jobPostingModal').css('display', 'block');
      });
  
      $('#closeModal').click(function () { 
          $('#jobPostingModal').css('display', 'none');
      });
  
      $(window).click(function (e) {
          if (e.target === document.getElementById('jobPostingModal')) {
              $('#jobPostingModal').css('display', 'none');
          }
      });
      var addedJobListings = [];
    $('#jobPostingForm').submit(function (e) {
      e.preventDefault();
      const jobId = nextJobId++;
      var company = $('#company').val();
      var logo = $('#logo').val(); 
      var newJob = $('#new').is(':checked');
      var featured = $('#featured').is(':checked');
      var position = $('#position').val();
      var role = $('#role').val();
      var level = $('#level').val();
      var postedAt = $('#postedAt').val();
      var contract = $('#contract').val();
      var location = $('#location').val();
      var languages = $('#languages').val().split(',').map(function (item) {
          return item.trim();
      });
      var tools = $('#tools').val().split(',').map(function (item) {
          return item.trim();
      });
      var job = {
        "id": jobId,
          "company": company,
          "logo": logo,
          "new": newJob,
          "featured": featured,
          "position": position,
          "role": role,
          "level": level,
          "postedAt": postedAt,
          "contract": contract,
          "location": location,
          "languages": languages,
          "tools": tools
      };

      addedJobListings.push(job);
      var jobListing = $("<div class='job-listing'></div>");
  
      var jobListingCol1 = $("<div class='col1'></div>");
      var jobListingCol2 = $("<div class='col2'></div>");
      var jobListingCol3 = $("<div class='col3'></div>");
      var jobLogo = $("<img class='job-listing__logo' src='" + job.logo + "'>");
      jobListingCol1.append(jobLogo);
      var jobListingCol2Row1 = $("<div class='col2row1'></div>");
      var jobCompany = $("<p class='job-listing__company'>").text(job.company);
      jobListingCol2Row1.append(jobCompany);
      if (job.new) {
          var jobNew = $("<span class='job-listing__new'>New!</span>");
          jobListingCol2Row1.append(jobNew);
        }

      if (job.featured) {
          var jobFeatured = $("<span class='job-listing__featured'>Featured</span>");
          jobListingCol2Row1.append(jobFeatured);
        }
      
      jobListingCol2.append(jobListingCol2Row1)
      
      var jobListingCol2Row2 = $("<div class='col2row2'></div>");
      var jobTitle = $("<h3>").text(job.position);
      jobListingCol2Row2.append(jobTitle);
      var jobListingCol2Row3 = $("<div class='col2row3'></div>");
      var jobLocation = $("<p class='job-listing__location'>").text(job.location);  
      var jobpostedAt = $("<p class='job-listing__postedAt'>").text(job.postedAt);
      var jobcontract = $("<p class='job-listing__jobcontract'>").text(job.contract);
      jobListingCol2Row3.append(jobpostedAt);
      jobListingCol2Row3.append(jobcontract);
      jobListingCol2Row3.append(jobLocation);
      var jobRole = $("<p class='job-listing__role'>").text(job.role);
      var jobLevel = $("<p class='job-listing__level'>").text(job.level);
      var languagesList = $("<ul class='job-listing__languages'>");
      var languages = job.languages;

      $.each(languages, function(index, language) {
      var languageItem = $("<li>").text(language);
      languagesList.append(languageItem);
      });

      jobListingCol3.append(jobRole);
      jobListingCol3.append(jobLevel);
      jobListingCol3.append(languagesList);
      var deleteicon = $("<i class='fa fa-trash'></i>")
      jobListingCol3.append(deleteicon);



      jobListingCol2.append(jobListingCol2Row2);
      jobListingCol2.append(jobListingCol2Row3);



      jobListing.append(jobListingCol1);
      jobListing.append(jobListingCol2);
      jobListing.append(jobListingCol3);

      jobListing.click(function(){
          var popup = $("<div class='popup'>");

          popup.append("<h2>" + job.company + "</h2>");
          popup.append("<img src='"+job.logo+"'"+"</img>");
          popup.append("<p>" + job.position + "</p>");
          popup.append("<p>" + job.role + "</p>");
          popup.append("<p>" + job.level + "</p>");
          popup.append("<p>" + job.postedAt + "</p>");
          popup.append("<p>" + job.contract + "</p>");
          popup.append("<p>" + job.location + "</p>");
          popup.append("<p>Languages: " + job.languages.join(", ") + "</p>");
          popup.append("<p>Tools: " + job.tools.join(", ") + "</p>");

          var closeButton = $("<button>Close</button>");
          closeButton.click(function() {
            popup.remove();
          });
          popup.append(closeButton);

          $("body").append(popup);
      });
      jobListing.attr('data-job-id', jobId);

      deleteicon.click(function() {
          var jobid = jobListing.attr('data-job-id');
          $('[data-job-id="' + jobid + '"]').remove();
      });

      $("#job-listings").append(jobListing);
      console.log(JSON.stringify(job, null, 2));         
  });
});



